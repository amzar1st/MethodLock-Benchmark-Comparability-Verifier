import json
from pathlib import Path
import pytest

F=json.loads(Path('public/fixtures.json').read_text())

@pytest.fixture
def c(direct_deploy):
    return direct_deploy('contracts/methodlock.py', sdk_version='v0.2.12')

def lock(c):
    return c.lock_protocol(json.dumps(F['protocol']))

def rows(run):
    return [dict(requirement_id=rid,status='SATISFIED',code='NONE',evidence_id='REPORT' if rid!='EXECUTION_EVIDENCE' else 'CONFIG_LOG',quote=run['report'][:80] if rid!='EXECUTION_EVIDENCE' else run['evidence'][0]['text'][:80],reason='Supported by the committed excerpt.') for rid in ('TIMING','QUALITY_METHOD','EXECUTION_EVIDENCE')]

def mock(direct_vm, value):
    direct_vm.mock_llm('independent benchmark methodology auditor',json.dumps({'findings':value}))

def test_full_lifecycle(c,direct_vm):
    pid=lock(c); rid=c.submit_run(pid,json.dumps(F['runs'][0])); mock(direct_vm,rows(F['runs'][0]))
    c.assess_methodology(rid)
    assert json.loads(c.get_run(rid))['outcome']=='COMPARABLE'
    c.finalize_result(rid)
    assert json.loads(c.get_run(rid))['phase']=='FINALIZED'
    assert json.loads(c.get_deviations(rid))==[]
    with pytest.raises(Exception): c.finalize_result(rid)
    with pytest.raises(Exception): c.assess_methodology(rid)

def test_commitments_and_immutability(c):
    pid=lock(c); rid=c.submit_run(pid,json.dumps(F['runs'][0])); a=json.loads(c.get_run(rid))
    assert len(a['commitment'])==64 and a['protocol_hash']==json.loads(c.get_protocol(pid))['hash']
    assert json.loads(c.get_counts())=={'protocols':1,'runs':1}
    assert len(json.loads(c.list_runs(1,20)))==1
    assert json.loads(c.list_runs(2,20))==[]

@pytest.mark.parametrize('index,expected',[(0,'COMPARABLE'),(1,'PROTOCOL_DEVIATION'),(2,'PROTOCOL_DEVIATION'),(3,'INSUFFICIENT_EVIDENCE'),(4,'INSUFFICIENT_EVIDENCE')])
def test_five_cases(c,direct_vm,index,expected):
    pid=lock(c); r=F['runs'][index]; rid=c.submit_run(pid,json.dumps(r)); findings=rows(F['runs'][0])
    if index==1:
        findings=rows(r)
        findings[0].update(status='DEVIATION',code='TIMING_EXCLUSION',quote=r['report'][:110])
    if index==2:
        findings=rows(r)
    if index==3:
        findings=rows(r)
        findings[2].update(status='UNKNOWN',code='CLAIM_UNSUPPORTED',evidence_id='',quote='')
    if index==4: findings[2].update(status='UNKNOWN',code='EVIDENCE_MISSING',evidence_id='',quote='')
    mock(direct_vm,findings); c.assess_methodology(rid); c.finalize_result(rid)
    assert json.loads(c.get_run(rid))['outcome']==expected

@pytest.mark.parametrize('key,value', [('batch_size',True),('min_quality_bps',10001),('sample_tolerance',1000),('timing_scope','')])
def test_invalid_protocol(c,key,value):
    p=dict(F['protocol']);p[key]=value
    with pytest.raises(Exception): c.lock_protocol(json.dumps(p))

@pytest.mark.parametrize('key,value', [('batch_size',True),('latency_us',0),('quality_bps',10001),('dataset_version','2')])
def test_invalid_disclosures_deviate(c,direct_vm,key,value):
    r=json.loads(json.dumps(F['runs'][0]));r['disclosures'][key]=value
    rid=c.submit_run(lock(c),json.dumps(r));mock(direct_vm,rows(r));c.assess_methodology(rid)
    assert json.loads(c.get_run(rid))['outcome']=='PROTOCOL_DEVIATION'

def test_missing_disclosure_unknown(c,direct_vm):
    r=json.loads(json.dumps(F['runs'][0]));del r['disclosures']['hardware']
    rid=c.submit_run(lock(c),json.dumps(r));mock(direct_vm,rows(r));c.assess_methodology(rid)
    assert json.loads(c.get_run(rid))['outcome']=='INSUFFICIENT_EVIDENCE'

def test_citation_fabrication_rejected(c,direct_vm):
    rid=c.submit_run(lock(c),json.dumps(F['runs'][0]));rr=rows(F['runs'][0]);rr[0]['quote']='fabricated passage not in the evidence';mock(direct_vm,rr)
    with pytest.raises(Exception): c.assess_methodology(rid)
    assert json.loads(c.get_run(rid))['phase']=='SUBMITTED'

def test_no_early_finalization(c):
    with pytest.raises(Exception): c.finalize_result('404')
    rid=c.submit_run(lock(c),json.dumps(F['runs'][0]))
    with pytest.raises(Exception): c.finalize_result(rid)

@pytest.mark.parametrize('start,limit',[(0,1),(1,21),(1,0)])
def test_page_bounds(c,start,limit):
    with pytest.raises(Exception): c.list_runs(start,limit)

def test_missing_protocol(c):
    with pytest.raises(Exception): c.submit_run('404',json.dumps(F['runs'][0]))

def test_duplicate_evidence(c):
    r=json.loads(json.dumps(F['runs'][0]));r['evidence']*=2
    with pytest.raises(Exception): c.submit_run(lock(c),json.dumps(r))


def test_validator_independent_disagreement(c,direct_vm):
    r=F['runs'][0];rid=c.submit_run(lock(c),json.dumps(r));rr=rows(r);mock(direct_vm,rr);c.assess_methodology(rid)
    assert direct_vm.run_validator() is True
    direct_vm.clear_mocks()
    changed=rows(r);changed[0].update(status='UNKNOWN',code='CLAIM_UNSUPPORTED',evidence_id='',quote='')
    mock(direct_vm,changed)
    assert direct_vm.run_validator() is False

def test_reason_wording_does_not_change_consensus(c,direct_vm):
    r=F['runs'][0];rid=c.submit_run(lock(c),json.dumps(r));rr=rows(r);mock(direct_vm,rr);c.assess_methodology(rid)
    direct_vm.clear_mocks()
    for row in rr: row['reason']='Independently worded explanation of the same evidence.'
    mock(direct_vm,rr)
    assert direct_vm.run_validator() is True
