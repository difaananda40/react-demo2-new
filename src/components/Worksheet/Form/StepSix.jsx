import React, { Fragment, useEffect, useState } from 'react';
import { useFormContext, Controller, useFieldArray, useWatch } from "react-hook-form";
import {
  Form,
  Row,
  Col,
  Card,
  Button
} from 'react-bootstrap';
import Select from "../../Shared/Select";
import moment from 'moment';
import { getOperation } from '../../helper.js';

// Data from JSON file
import workflowsJson from '../../Dummy/ic4pro_auditworkflow.json';

const StepSix = () => {
  const { register, errors, control, setValue, mode, selectedData, reset, getValues } = useFormContext();

  useEffect(() => {
    if(selectedData && (mode !== 'create' || mode === null)) {
      reset({
        ...getValues(),
        worksheetStatus: workflowsJson.find(wf => wf.key === selectedData.worksheetStatus),
        recordCounter: parseInt(selectedData.recordCounter)
      })
    }
    else {
      reset({
        worksheetStatus: workflowsJson.find(wf => wf.key === 'New'),
        recordCounter: 0
      })
    }
  }, [selectedData])

  return (
    <Fragment>
      <Card>
        <Card.Header className="font-weight-bold" style={{ backgroundColor: '#FFC107' }}>
          Audit Log Status
        </Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <Form.Group controlId="worksheetStatus">
                <Form.Label sm="4">
                  Worksheet Status*
                </Form.Label>
                <Controller
                  name="worksheetStatus"
                  as={Select}
                  options={workflowsJson}
                  control={control}
                  getOptionValue={option => option.key}
                  getOptionLabel={option => option.description}
                  rules={{ required: 'Worksheet Status is required!' }}
                  isInvalid={errors.worksheetStatus}
                  disabled={mode === 'create' || mode === 'view' || mode === 'delete' }
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="dateInitiated">
                <Form.Label>
                  Date Initiated
                </Form.Label>
                <Form.Control name="dateInitiated" ref={register} readOnly defaultValue={moment().format('DD/MM/YYYY')} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="initiator">
                <Form.Label>
                  Initiator
                </Form.Label>
                <Form.Control name="initiator" ref={register} readOnly defaultValue="user_id" />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="recordDate">
                <Form.Label>
                  Record Date
                </Form.Label>
                <Form.Control name="recordDate" ref={register} readOnly defaultValue={moment().format('DD/MM/YYYY')} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="recordTime">
                <Form.Label>
                  Record Time
                </Form.Label>
                <Form.Control name="recordTime" ref={register} readOnly defaultValue={moment().format('HH:mm:ss')} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="operation">
                <Form.Label>
                  Operation
                </Form.Label>
                <Form.Control name="operation" ref={register} readOnly defaultValue={getOperation(mode)} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="workstation">
                <Form.Label>
                  Workstation
                </Form.Label>
                <Form.Control name="workstation" ref={register} readOnly defaultValue="workstation"/>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="recordCounter">
                <Form.Label>
                  No. Counter
                </Form.Label>
                <Form.Control name="recordCounter" ref={register} readOnly />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Fragment>
  )
}

function compare(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export default React.memo(StepSix, compare);