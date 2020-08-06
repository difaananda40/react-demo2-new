import React, { Fragment, useEffect, useState } from 'react';
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import {
  Form,
  Row,
  Col,
  Card,
  Button
} from 'react-bootstrap';
import Select from "../../Shared/Select";

// Data from JSON file
import objectivesJson from '../../Dummy/ic4pro_auditObjective.json';

const StepFour = () => {
  const { register, errors, control, getValues, reset, selectedData, mode } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "auditObjectives"
  });

  useEffect(() => {
    if(mode === 'create') append();
  }, [append])

  useEffect(() => {
    if(selectedData && (mode !== 'create' || mode === null)) {
      reset({
        ...getValues(),
        auditObjectives: selectedData.auditObjectives.map(ao => objectivesJson.find(oj => oj.key === ao.objectiveId)),
        otherObjectives: selectedData.otherObjectives
      })
    }
  }, [selectedData, reset, getValues])

  return (
    <Fragment>
      <Card>
        <Card.Header className="font-weight-bold" style={{ backgroundColor: '#FFC107' }}>
          Audit Objectives
        </Card.Header>
        <Card.Body>
        <Form.Label>
                  Objectives
                </Form.Label>
          {fields.map((item, index) => (
            <Row key={item.id}>
              <Form.Group  as={Col} controlId={`auditObjectives[${index}]`}>
                
                <Controller
                  name={`auditObjectives[${index}]`}
                  as={Select}
                  options={objectivesJson}
                  control={control}
                  getOptionValue={option => option.key}
                  getOptionLabel={option => option.description}
                  rules={{ required: 'Objective is required!' }}
                  isInvalid={errors.auditObjectives?.[index]}
                />
              </Form.Group>
              {fields.length > 1 && (
                <Form.Group as={Col} controlId={`auditObjectives[${index}].delete`}
                  className="d-flex align-items-center justify-content-center" xs="auto"
                >
                  <Button variant="danger" onClick={() => remove(index)}>Delete</Button>
                </Form.Group>
              )}
            </Row>
          ))}
          <Form.Group>
            <Button variant="primary" type="button" onClick={append}>Add Objective</Button>
          </Form.Group>
        </Card.Body>
      </Card>
      <Card className="mt-3">
        <Card.Header className="font-weight-bold" style={{ backgroundColor: '#FFC107' }}>
          Other Objectives
        </Card.Header>
        <Card.Body>
          <Form.Group controlId="otherObjectives">
            <Form.Control
              as="textarea"
              rows="5"
              name="otherObjectives"
              ref={register}
              isInvalid={errors.otherObjectives}
              placeholder="Other Objectives..."
            />
          </Form.Group>
        </Card.Body>
      </Card>
    </Fragment>
  )
}

function compare(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export default React.memo(StepFour, compare);