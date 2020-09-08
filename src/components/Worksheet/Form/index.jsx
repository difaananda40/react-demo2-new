import React, { Suspense, lazy, useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Card,
  Tab,
  Nav
} from 'react-bootstrap';
import { useForm, FormProvider } from "react-hook-form";
import moment from 'moment';

// Data from JSON file
import worksheetsJson from '../../Dummy/ic4pro_auditworksheets.json';
import branchesJson from '../../Dummy/ic4pro_branches.json';
import monthsJson from '../../Dummy/ic4pro_auditMonths.json';
import yearsJson from '../../Dummy/ic4pro_auditYears.json';
import inspectionTypesJson from '../../Dummy/ic4pro_inspectiontypes.json';
import designatesJson from '../../Dummy/ic4pro_designates.json';
import usersJson from '../../Dummy/ic4pro_users.json';
import coveragesJson from '../../Dummy/ic4pro_auditCoverage.json';
import objectivesJson from '../../Dummy/ic4pro_auditObjective.json';
import workflowsJson from '../../Dummy/ic4pro_auditworkflow.json';

const jobStayYears = new Array(25 + 1).fill().map((e,i) => {
  return {label: i, value: i}
});

const jobStayMonths = new Array(10 + 1).fill().map((e,i) => {
  return {label: i, value: i}
});

// Step Components
const StepOne = lazy(() => import('./StepOne'));
const StepTwo = lazy(() => import('./StepTwo'));
const StepThree = lazy(() => import('./StepThree'));
const StepFour = lazy(() => import('./StepFour'));
const StepFive = lazy(() => import('./StepFive'));
const StepSix = lazy(() => import('./StepSix'));

const FormContainer = ({
  show,
  mode,
  handleForm,
  submitForm,
  selectedData,
  deleteData
}) => {
  const [ tabKey, setTabKey ] = useState('tab1');

  const { reset, ...methods } = useForm();

  useEffect(() => {
    if(selectedData && mode !== 'create') {
      reset({
        // Step 1
        worksheetId: selectedData.worksheetId,
        branchId: branchesJson.data.find(bc => bc.branchId === selectedData.branchId),
        startMonth: monthsJson.find(m => m.monthName === selectedData.startMonth),
        startYear: yearsJson.find(y => y.auditYear === selectedData.startYear),
        endMonth: monthsJson.find(m => m.monthName === selectedData.endMonth),
        endYear: yearsJson.find(y => y.auditYear === selectedData.endYear),
        visitPeriodStart: moment(selectedData.visitPeriodStart, 'YYYYMMDD').toDate(),
        visitPeriodEnd: moment(selectedData.visitPeriodEnd, 'YYYYMMDD').toDate(),
        exitMeetingDate: moment(selectedData.exitMeetingDate, 'YYYYMMDD').toDate(),
        inspectionType: inspectionTypesJson.find(it => it.key === selectedData.inspectionType),
        lastAuditVisit: worksheetsJson.find(dt => dt.worksheetId === selectedData.worksheetId)?.[0],
        auditIntro: selectedData.auditIntro,
        // Step 2
        keyOfficers: selectedData.keyofficers.map(sd => ({
          staffName: usersJson.find(uj => uj.userid === sd.staffName),
          datejoin: moment(sd.datejoin, 'YYYYMMDD').toDate(),
          jobStayYear: jobStayYears.find(y => y.value === parseInt(sd.jobStayYear)),
          jobStayMonth: jobStayMonths.find(m => m.value === parseInt(sd.jobStayMonth))
        })),
        // Step 3
        auditTeams: selectedData.auditTeam.map(at => ({
          auditorId: usersJson.find(uj => uj.userid === at.auditorId),
          coverages: at.specificCoverage.map(sc => (coveragesJson.find(cv => sc.areaInspected === cv.key)))
        })),
        reviewers: selectedData.reviewers.map(rv => ({
          reviewer: usersJson.find(uj => uj.userid === rv.reviewer)
        })),
        approver: usersJson.find(uj => uj.userid === selectedData.approver),
        // Step 4
        auditObjectives: selectedData.auditObjectives.map(ao => ({ value: objectivesJson.find(oj => oj.key === ao.objectiveId) })),
        otherObjectives: selectedData.otherObjectives,
        // Step 5
        approachDetail: selectedData.approachDetail,
        approaches: selectedData.approaches.map(ap => ({
          approach: coveragesJson.find(cj => cj.key === ap.approach),
          approachPercent: ap.approachPercent
        })),
        // Step 6
        worksheetStatus: workflowsJson.find(wf => wf.key === selectedData.worksheetStatus),
        recordCounter: parseInt(selectedData.recordCounter),
      })
    }
    else {
      reset({
        // Step 1
        branchId: '',
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        visitPeriodStart: '',
        visitPeriodEnd: '',
        exitMeetingDate: '',
        inspectionType: '',
        lastAuditVisit: '',
        auditIntro: '',
        // Step 2
        keyOfficers: [{}],
        // Step 3
        auditTeams: [{}],
        reviewers: [{}],
        approver: null,
        // Step 4
        auditObjectives: [{}],
        otherObjectives: null,
        // Step 5
        approachDetail: null,
        approaches: [{}],
        // Step 6
        worksheetStatus: workflowsJson.find(wf => wf.key === 'New'),
        recordCounter: 0
      });
    }
  }, [mode, reset, selectedData])

  useEffect(() => {
    setTabKey('tab1');
  }, [mode])

  const getDesignate = React.useCallback((designate) => {
    const designateFind = designatesJson.find(de => de.designate_id === designate)
    return designateFind?.designate_name;
  }, []);

  const getFullName = React.useCallback((staffName) => {
    const user = usersJson.find(us => us.userid === staffName);
    return `${user.title}. ${user.firstName} ${user.lastNamme}`;
  }, [])

  const onSubmit = data => {
    const newData = {
      ...data,
      keyofficers: data.keyOfficers.map(ko => ({
        ...ko,
        datejoin: moment(ko.datejoin).format('YYYYMMDD'),
        jobStayMonth: ko.jobStayMonth.value,
        jobStayYear: ko.jobStayYear.value,
        staffName: ko.staffName.userid
      })),
      auditObjectives: data.auditObjectives.map(ao => ({ objectiveId: ao.value.key })),
      approaches: data.approaches.map(ap => ({ ...ap, approach: ap.approach.key })),
      approver: data.approver.userid,
      approverRole: data.approver.designate,
      auditTeam: data.auditTeams.map(at => ({ 
        ...at,
        auditorId: at.auditorId.userid,
        specificCoverage: at.coverages.map(atc => ({ areaInspected: atc.key }))
      })),
      dateInitiated: moment().format('YYYYMMDDHHmmss'),
      endMonth: data.endMonth.monthName,
      endYear: data.endYear.auditYear,
      exitMeetingDate: moment(data.exitMeetingDate).format('YYYYMMDD'),
      inspectionType: data.inspectionType.key,
      lastAuditVisit: data.lastAuditVisit,
      overdueDate: moment().format('YYYYMMDD'),
      recordCounter: mode === 'create' ? 1 : mode === 'edit' && parseInt(data.recordCounter) + 1,
      recordDate: moment().format('YYYYMMDD'),
      recordTime: moment().format('HHmmss'),
      reviewers: data.reviewers.map(rv => ({
        ...rv,
        reviewer: rv.reviewer.userid
      })),
      startMonth: data.startMonth.monthName,
      startYear: data.startYear.auditYear,
      visitPeriodEnd: moment(data.visitPeriodEnd).format('YYYYMMDD'),
      visitPeriodStart: moment(data.visitPeriodStart).format('YYYYMMDD'),
      worksheetStatus: data.worksheetStatus.description
    }
    submitForm(newData, mode)
    reset();
  };

  return (
    <Modal
      show={show}
      onHide={handleForm}
      backdrop="static"
      keyboard={false}
      dialogClassName="modal-90w"
    >
      <FormProvider
        {...methods}
        reset={reset}
        selectedData={selectedData}
        mode={mode}
        methods={{
          getDesignate,
          getFullName
        }}
        datas={{
          worksheetsJson,
          branchesJson,
          monthsJson,
          yearsJson,
          inspectionTypesJson,
          designatesJson,
          usersJson,
          jobStayMonths,
          jobStayYears,
          coveragesJson,
          objectivesJson,
          workflowsJson,
        }}
      >
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Modal.Header style={{ backgroundColor: '#8C00FF' }}>
            <Modal.Title className="text-capitalize">{mode} Worksheet</Modal.Title>
            <div>
              {
                mode === 'delete'
                ? (
                  <Button
                    variant="info"
                    className="border border-white"
                    size="sm"
                    onClick={deleteData}
                    type="button"
                  >
                  Delete
                </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="info"
                    className="border border-white"
                    size="sm"
                    disabled={mode === 'view'}
                  >
                    Save
                  </Button>
                )
              }
              <Button
                variant="success"
                size="sm"
                className="border border-white ml-1"
                onClick={handleForm}
              >
                Cancel
              </Button>
              <Button variant="danger" className="border border-white ml-1" size="sm">Help</Button>
            </div>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#F2F2F2' }}>
            <Tab.Container id="tab-controlled" activeKey={tabKey} onSelect={(key) => setTabKey(key)} mountOnEnter={true}>
              <Card>
                <Card.Header>
                  <Nav variant="tabs">
                    <Nav.Item>
                      <Nav.Link eventKey="tab1">Introduction</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="tab2">Key Officers</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="tab3">Inspection Team</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="tab4">Objectives</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="tab5">Approaches</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="tab6">Audit Log and Status</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>
                <Card.Body>
                  <Tab.Content>
                    <Suspense fallback={<div>Loading...</div>}>
                      <Tab.Pane eventKey="tab1">
                        <StepOne />
                      </Tab.Pane>
                      <Tab.Pane eventKey="tab2">
                        <StepTwo />
                      </Tab.Pane>
                      <Tab.Pane eventKey="tab3">
                        <StepThree />
                      </Tab.Pane>
                      <Tab.Pane eventKey="tab4">
                        <StepFour />
                      </Tab.Pane>
                      <Tab.Pane eventKey="tab5">
                        <StepFive />
                      </Tab.Pane>
                      <Tab.Pane eventKey="tab6">
                        <StepSix />
                      </Tab.Pane>
                    </Suspense>
                  </Tab.Content>
                </Card.Body>
              </Card>
            </Tab.Container>
          </Modal.Body>
        </form>
      </FormProvider>
    </Modal>
  )
}

function compare(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export default React.memo(FormContainer, compare);