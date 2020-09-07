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

const StepFive = () => {
  const { register, errors, control, mode, datas } = useFormContext();
  const {
    coveragesJson
  } = datas;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "approaches"
  });

  const [ overallCoverage, setOverallCoverage ] = useState(null);

  const watchApproaches = useWatch({ name: 'approaches' });

  // Calculator Overall Coverage
  useEffect(() => {
    if(watchApproaches) {
      const approachesCount = watchApproaches.length;
      const approachesSum = watchApproaches.reduce((acc, curr) => acc + parseFloat(curr.approachPercent || 0), 0)
      setOverallCoverage(approachesSum / approachesCount)
    }
  }, [watchApproaches])

  const getGrade = (percentage) => {
    if(percentage >= 80 && percentage <= 100) return 'A';
    else if(percentage >= 60 && percentage <= 79) return 'B';
    else if(percentage >= 30 && percentage <= 59) return 'C';
    else if(percentage <= 29) return 'Fail';
    else return 'No grade';
  }

  return (
    <Fragment>
      <Card>
        <Card.Header className="font-weight-bold" style={{ backgroundColor: '#FFC107' }}>
          Audit Approaches
        </Card.Header>
        <Card.Body>
          <Form.Group controlId="approachDetail">
            <Form.Control
              as="textarea"
              rows="5"
              name="approachDetail"
              ref={register}
              isInvalid={errors.approachDetail}
              placeholder="Approach Detail..."
              disabled={mode === 'view' || mode === 'delete'}
            />
          </Form.Group>
        </Card.Body>
      </Card>
      <Card className="mt-3">
        <Card.Header className="font-weight-bold" style={{ backgroundColor: '#FFC107' }}>
          Approaches
        </Card.Header>
        <Card.Body>
          {fields.map((item, index) => (
            <Row key={item.id}>
              <Form.Group as={Col} xs="12" md="4" controlId={`approaches[${index}].approach`}>
                <Form.Label>
                  Approach {index + 1}*
                </Form.Label>
                <Controller
                  name={`approaches[${index}].approach`}
                  as={Select}
                  options={coveragesJson}
                  control={control}
                  getOptionValue={option => option.key}
                  getOptionLabel={option => option.description}
                  rules={{ required: 'Approach is required!' }}
                  isInvalid={errors.approaches?.[index]?.approach}
                  disabled={mode === 'view' || mode === 'delete'}
                  defaultValue={item.approach || ""}
                />
              </Form.Group>
              <Form.Group as={Col} xs="12" md="4" controlId={`approaches[${index}].approachPercent`}>
                <Form.Label>
                  Approach Percent*
                </Form.Label>
                <Form.Control
                  type="number"
                  name={`approaches[${index}].approachPercent`}
                  isInvalid={errors.approaches?.[index]?.approachPercent}
                  placeholder="Approach Percent..."
                  ref={register({
                    required: 'Approach Percent is required!',
                    min: {
                      value: 0,
                      message: 'Minimum value is 0!'
                    },
                    max: {
                      value: 100,
                      message: 'Max value is 100!'
                    }
                  })}
                  defaultValue={item.approachPercent}
                  disabled={mode === 'view' || mode === 'delete'}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.approaches?.[index]?.approachPercent?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} xs="12" md="auto" controlId={`approaches[${index}].approachGrade`}>
                <Form.Label>
                  Grade
                </Form.Label>
                <Form.Control
                  name={`approaches[${index}].approachGrade`}
                  ref={register} 
                  disabled
                  value={getGrade(watchApproaches?.[index]?.approachPercent)}
                />
              </Form.Group>
              {(mode === 'create' || mode === 'edit') && fields.length > 1 && (
                <Form.Group as={Col} controlId={`approaches[${index}].delete`}
                  className="d-flex align-items-center justify-content-center" xs="auto"
                >
                  <Button variant="danger" onClick={() => remove(index)}>Delete</Button>
                </Form.Group>
              )}
            </Row>
          ))}
          {(mode === 'create' || mode === 'edit') && (
            <Form.Group>
              <Button variant="primary" type="button" onClick={append}>Add Approach</Button>
            </Form.Group>
          )}
          <Form.Group as={Row} className="mt-3">
            <Form.Label column xs="2">
              Overall Coverage
            </Form.Label>
            <Col xs="6">
              <Form.Control
                type="number"
                name="overallCoverage"
                defaultValue={overallCoverage}
                disabled
              />
            </Col>
            <Col xs="4">
              <Form.Control
                name="overallCoverageGrade"
                value={getGrade(overallCoverage)}
                ref={register}
                disabled
              />
            </Col>
          </Form.Group>
        </Card.Body>
      </Card>
    </Fragment>
  )
}

function compare(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export default React.memo(StepFive, compare);