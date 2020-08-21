import React, { Suspense, lazy, useState, useEffect, useMemo } from 'react';
import {
  Modal,
  Button,
  Card,
  Tab,
  Nav
} from 'react-bootstrap';
import { useForm, FormProvider } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import moment from 'moment';

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

  const handleTab = (type) => {
    let lastNum = parseInt(tabKey[tabKey.length - 1]);
    if(type === 'next') lastNum += 1
    else if(type ==='prev') lastNum -= 1
    setTabKey('tab' + lastNum);
  }

  const { reset, ...methods } = useForm();

  useEffect(() => {
    if(mode === 'create') {
      reset();
    }
    setTabKey('tab1');
  }, [mode, reset])

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
      auditObjectives: data.auditObjectives.map(ao => ({ objectiveId: ao.key })),
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
      <FormProvider {...methods} reset={reset} selectedData={selectedData} mode={mode}>
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
            <Tab.Container id="tab-controlled" activeKey={tabKey} onSelect={(key) => setTabKey(key)}>
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
                    {/* <div className="d-flex flex-row justify-content-end mt-3">
                      {tabKey !== 'tab1' && <Button className="mr-2" variant="danger" onClick={() => handleTab('prev')}>Previous</Button>}
                      {tabKey !== 'tab6' && <Button onClick={() => handleTab('next')}>Next</Button>}
                    </div> */}
                  </Tab.Content>
                </Card.Body>
              </Card>
            </Tab.Container>
          </Modal.Body>
        </form>
        {/* <DevTool control={methods.control} /> */}
      </FormProvider>
    </Modal>
  )
}

function compare(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export default React.memo(FormContainer, compare);