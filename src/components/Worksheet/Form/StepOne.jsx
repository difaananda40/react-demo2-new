import React, { Fragment, useState, useEffect } from 'react';
import { useFormContext, Controller, useWatch } from "react-hook-form";
import {
  Form,
  Row,
  Col,
  Card,
  Button,
  Modal
} from 'react-bootstrap';
import moment from 'moment';
import Select from "../../Shared/Select";
import Datepicker from "../../Shared/Datepicker";

// Data from JSON file
import worksheets from '../../Dummy/ic4pro_auditworksheets.json';
import branches from '../../Dummy/ic4pro_branches.json';
import months from '../../Dummy/ic4pro_auditMonths.json';
import years from '../../Dummy/ic4pro_auditYears.json';
import inspectionTypes from '../../Dummy/ic4pro_inspectiontypes.json';
import designatesJson from '../../Dummy/ic4pro_designates.json';
import usersJson from '../../Dummy/ic4pro_users.json';

const StepOne = () => {

  // Modal Last Audit Detail
  const [ show, setShow ] = useState(false);
  const handleModal = () => setShow(prev => !prev);

  const getDesignate = React.useCallback((designate) => {
    const designateFind = designatesJson.find(de => de.designate_id === designate)
    return designateFind?.designate_name;
  }, []);

  const getFullName = React.useCallback((staffName) => {
    const user = usersJson.find(us => us.userid === staffName);
    return `${user.title}. ${user.firstName} ${user.lastNamme}`;
  }, [])
  // End modal

  const { register, errors, control, getValues, reset, selectedData, mode } = useFormContext();

  const watchBranchId = useWatch({ name: 'branchId' });

  const worksheetsFiltered = React.useMemo(() => worksheets.filter(dt => dt.branchId === watchBranchId?.branchId)[0]
  , [watchBranchId]);

  const selectedInspectionType = React.useMemo(() => inspectionTypes.find(it => it.key === worksheetsFiltered?.inspectionType)?.description, [worksheetsFiltered])

  useEffect(() => {
    if(selectedData && (mode !== 'create' || mode === null)) {
      reset({
        ...getValues(),
        worksheetId: selectedData.worksheetId,
        branchId: branches.data.find(bc => bc.branchId === selectedData.branchId ),
        startMonth: months.find(m => m.monthName === selectedData.startMonth),
        startYear: years.find(y => y.auditYear === selectedData.startYear),
        endMonth: months.find(m => m.monthName === selectedData.endMonth),
        endYear: years.find(y => y.auditYear === selectedData.endYear),
        visitPeriodStart: moment(selectedData.visitPeriodStart, 'YYYYMMDD').toDate(),
        visitPeriodEnd: moment(selectedData.visitPeriodEnd, 'YYYYMMDD').toDate(),
        exitMeetingDate: moment(selectedData.exitMeetingDate, 'YYYYMMDD').toDate(),
        inspectionType: inspectionTypes.find(it => it.key === selectedData.inspectionType),
        lastAuditVisit: worksheets.find(dt => dt.worksheetId === selectedData.worksheetId)[0],
        auditIntro: selectedData.auditIntro
      })
    }
    else {
      reset({
        ...getValues(),
        branchId: null,
        startMonth: null,
        startYear: null,
        endMonth: null,
        endYear: null,
        visitPeriodStart: null,
        visitPeriodEnd: null,
        exitMeetingDate: null,
        inspectionType: null,
        lastAuditVisit: null
      });
    }
  }, [getValues, mode, reset, selectedData])

  return (
    <Fragment>
      <Card>
        <Card.Header className="font-weight-bold" style={{ backgroundColor: '#FFC107' }}>
          Inspection Layer
        </Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <Form.Group as={Row} controlId="worksheetId">
                <Form.Label column sm="8">
                  Worksheet ID*
                </Form.Label>
                <Col sm="4">
                  <Form.Control
                    type="text"
                    name="worksheetId"
                    ref={register}
                    defaultValue={`WK${moment().format('YYYYMMDDHHmmss')}`}
                    readOnly
                  />
                </Col>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group as={Row} controlId="branchId">
                <Form.Label column sm="4">
                  Branch Name*
                </Form.Label>
                <Col sm="8">
                  <Controller
                    name="branchId"
                    as={Select}
                    size="sm"
                    options={branches.data}
                    control={control}
                    getOptionValue={option => option.branchId}
                    getOptionLabel={option => option.branchId + ' - ' + option.branchName}
                    rules={{ required: 'Branch name is required!' }}
                    isInvalid={errors.branchId}
                    disabled={mode === 'view' || mode === 'delete'}
                    defaultValue=""
                  />
                </Col>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group as={Row} controlId="currentAuditPeriod">
            <Form.Label column sm="4">
              Current Audit Period*
            </Form.Label>
            <Col>
              <Controller
                name="startMonth"
                as={Select}
                options={months}
                control={control}
                getOptionValue={option => option.monthName}
                getOptionLabel={option => option.monthName}
                placeholder="Start Month..."
                rules={{ required: 'Start Month is required!' }}
                isInvalid={errors.startMonth}
                disabled={mode === 'view' || mode === 'delete'}
              />
            </Col>
            <Col>
              <Controller
                name="startYear"
                as={Select}
                options={years}
                control={control}
                getOptionValue={option => option.auditYear}
                getOptionLabel={option => option.auditYear}
                placeholder="Start Year..."
                rules={{ required: 'Start Year is required!' }}
                isInvalid={errors.startYear}
                disabled={mode === 'view' || mode === 'delete'}
              />
            </Col>
            <Col xs="auto" className="d-flex align-items-center font-weight-bold">to</Col>
            <Col>
              <Controller
                name="endMonth"
                as={Select}
                options={months}
                control={control}
                getOptionValue={option => option.monthName}
                getOptionLabel={option => option.monthName}
                placeholder="End Month..."
                rules={{ required: 'End Month is required!' }}
                isInvalid={errors.endMonth}
                disabled={mode === 'view' || mode === 'delete'}
              />
            </Col>
            <Col>
              <Controller
                name="endYear"
                as={Select}
                options={years}
                control={control}
                getOptionValue={option => option.auditYear}
                getOptionLabel={option => option.auditYear}
                placeholder="End Year..."
                rules={{ required: 'End Year is required!' }}
                isInvalid={errors.endYear}
                disabled={mode === 'view' || mode === 'delete'}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="visitPeriod">
            <Form.Label column sm="4">
              Visit Period*
            </Form.Label>
            <Col>
              <Controller
                control={control}
                name="visitPeriodStart"
                rules={{ required: 'Visit Period Start is required!' }}
                render={({ onChange, onBlur, value }) => (
                  <Fragment>
                    <Datepicker
                      onChange={onChange}
                      onBlur={onBlur}
                      isInvalid={errors.visitPeriodStart}
                      className="form-control is-invalid"
                      placeholderText="Visit Period Start..."
                      selected={value}
                      disabled={mode === 'view' || mode === 'delete'}
                    />
                  </Fragment>
                )}
              />
            </Col>
            <Col xs="auto" className="d-flex align-items-center font-weight-bold">to</Col>
            <Col>
              <Controller
                control={control}
                name="visitPeriodEnd"
                rules={{ required: 'Visit Period End is required!' }}
                render={({ onChange, onBlur, value }) => (
                  <Datepicker
                    onChange={onChange}
                    onBlur={onBlur}
                    isInvalid={errors.visitPeriodEnd}
                    className="form-control"
                    placeholderText="Visit Period End..."
                    selected={value}
                    disabled={mode === 'view' || mode === 'delete'}
                  />
                )}
              />
            </Col>
          </Form.Group>
          <Row>
            <Col>
              <Form.Group as={Row} controlId="exitMeetingDate">
                <Form.Label column sm="8">
                  Exit Meeting Date*
                </Form.Label>
                <Col>
                  <Controller
                    control={control}
                    name="exitMeetingDate"
                    rules={{ required: 'Exit Meeting Date is required!' }}
                    render={({ onChange, onBlur, value }) => (
                      <Fragment>
                        <Datepicker
                          onChange={onChange}
                          onBlur={onBlur}
                          isInvalid={errors.exitMeetingDate}
                          className="form-control is-invalid"
                          placeholderText="Exit Meeting Date..."
                          selected={value}
                          disabled={mode === 'view' || mode === 'delete'}
                        />
                      </Fragment>
                    )}
                  />
                </Col>
              </Form.Group>      
            </Col>
            <Col>
              <Form.Group as={Row} controlId="inspectionType">
                <Form.Label column sm="4">
                  Inspection Type*
                </Form.Label>
                <Col>
                  <Controller
                    name="inspectionType"
                    as={Select}
                    options={inspectionTypes}
                    control={control}
                    getOptionValue={option => option.key}
                    getOptionLabel={option => option.description}
                    placeholder="Inspection Type..."
                    rules={{ required: 'Inspection Type is required!' }}
                    isInvalid={errors.inspectionType}
                    disabled={mode === 'view' || mode === 'delete'}
                  />
                </Col>
              </Form.Group> 
            </Col>
          </Row>
          <Form.Group as={Row} controlId="lastAuditVisit">
            <Form.Label column sm="4">
              Last Audit Visit
            </Form.Label>
            <Col>
              <Form.Control
                type="text"
                name="lastAuditVisit"
                ref={register}
                value={worksheetsFiltered?.worksheetId || ''}
                readOnly
              />
            </Col>
            <Col xs="auto">
              <Button variant="primary" onClick={handleModal} disabled={!worksheetsFiltered?.worksheetId}>Detail</Button>
            </Col>
          </Form.Group>
        </Card.Body>
      </Card>
      <Card className="mt-3">
        <Card.Header className="font-weight-bold" style={{ backgroundColor: '#FFC107' }}>
          Introduction
        </Card.Header>
        <Card.Body>
          <Form.Group controlId="auditIntro">
            <Form.Control
              as="textarea"
              rows="5"
              name="auditIntro"
              ref={register}
              placeholder="Introduction..."
              disabled={mode === 'view' || mode === 'delete'}
            />
            <Form.Control.Feedback type="invalid">
              {errors.auditIntro?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Card.Body>
      </Card>
      <Modal
        show={show}
        onHide={handleModal}
        keyboard={false}
        size="lg"
        centered
      >
        <Modal.Header style={{ backgroundColor: '#8C00FF' }}>
          <Modal.Title className="text-capitalize text-light">
            Detail of {worksheetsFiltered?.worksheetId}
          </Modal.Title>
          <Button
            variant="success"
            size="sm"
            className="border border-white"
            onClick={handleModal}
          >
            Cancel
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} controlId="lastAuditWorksheetId">
            <Form.Label column sm="4">
              Worksheet Id
            </Form.Label>
            <Col>
              <Form.Control
                type="text"
                defaultValue={worksheetsFiltered?.worksheetId}
                readOnly
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="lastAuditInspectionType">
            <Form.Label column sm="4">
              Inspection Type
            </Form.Label>
            <Col>
              <Form.Control
                type="text"
                defaultValue={selectedInspectionType}
                readOnly
              />
            </Col>
          </Form.Group>
          <Row>
            <Form.Label column sm="4">
              Visit Period
            </Form.Label>
            <Col>
              <Form.Control
                type="text"
                defaultValue={moment(worksheetsFiltered?.visitPeriodStart, 'YYYYMMMMDD').format('DD MMMM YYYY')}
                readOnly
              />
            </Col>
            <Col xs="auto" className="d-flex align-items-center font-weight-bold">to</Col>
            <Col>
              <Form.Control
                type="text"
                defaultValue={moment(worksheetsFiltered?.visitPeriodEnd, 'YYYYMMMMDD').format('DD MMMM YYYY')}
                readOnly
              />
            </Col>
          </Row>
          <Card className="mt-3">
            <Card.Header className="font-weight-bold" style={{ backgroundColor: '#FFC107' }}>
              Key Officers
            </Card.Header>
            <Card.Body>
            {worksheetsFiltered?.keyofficers.map((ko, index) => (
              <Row key={index}>
                <Form.Group as={Col} sm="" controlId={`lastAuditVisitKeyOfficersStaffName${index}`}>
                  <Form.Label>
                    Staff Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={getFullName(ko.staffName)}
                    readOnly
                  />
                </Form.Group>
                <Form.Group as={Col} sm="" controlId={`lastAuditVisitKeyOfficersGradeLevel${index}`}>
                  <Form.Label>
                    Grade Level
                  </Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={ko.gradelevel}
                    readOnly
                  />
                </Form.Group>
                <Form.Group as={Col} sm="" controlId={`lastAuditVisitKeyOfficersDesignate${index}`}>
                  <Form.Label>
                    Function
                  </Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={getDesignate(ko.designate)}
                    readOnly
                  />
                </Form.Group>
              </Row>
            ))}
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}

function compare(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export default React.memo(StepOne, compare);