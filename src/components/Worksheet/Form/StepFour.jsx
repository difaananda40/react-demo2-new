import React, { Fragment } from 'react';
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import {
  Form,
  Row,
  Col,
  Card,
  Button
} from 'react-bootstrap';
import Select from "../../Shared/Select";

const StepFour = () => {
  const { register, errors, control, mode, datas } = useFormContext();
  const {
    objectivesJson
  } = datas;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "auditObjectives"
  });

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
              <Form.Group  as={Col} controlId={`auditObjectives[${index}].value`}>
                
                <Controller
                  name={`auditObjectives[${index}].value`}
                  as={Select}
                  options={objectivesJson}
                  control={control}
                  getOptionValue={option => option.key}
                  getOptionLabel={option => option.description}
                  rules={{ required: 'Objective is required!' }}
                  isInvalid={errors.auditObjectives?.[index].value}
                  disabled={mode === 'view' || mode === 'delete'}
                  defaultValue={item.value || ""}
                />
              </Form.Group>
              {(mode === 'create' || mode === 'edit') && fields.length > 1 && (
                <Form.Group as={Col} controlId={`auditObjectives[${index}].delete`}
                  className="d-flex align-items-center justify-content-center" xs="auto"
                >
                  <Button variant="danger" onClick={() => remove(index)}>Delete</Button>
                </Form.Group>
              )}
            </Row>
          ))}
          {(mode === 'create' || mode === 'edit') && (
            <Form.Group>
              <Button variant="primary" type="button" onClick={append}>Add Objective</Button>
            </Form.Group>
          )}
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
              disabled={mode === 'view' || mode === 'delete'}
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