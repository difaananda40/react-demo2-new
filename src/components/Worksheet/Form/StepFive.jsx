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

// Data from JSON file
import coveragesJson from '../../Dummy/ic4pro_auditCoverage.json';

const StepFive = () => {
  const { register, errors, control, getValues, reset, selectedData, mode } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "approaches"
  });

  useEffect(() => {
    if(mode === 'create') append();
  }, [append])

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

  useEffect(() => {
    if(selectedData && (mode !== 'create' || mode === null)) {
      reset({
        ...getValues(),
        approachDetail: selectedData.approachDetail,
        approaches: selectedData.approaches.map(ap => ({
          approach: coveragesJson.find(cj => cj.key === ap.approach),
          approachPercent: ap.approachPercent
        }))
      })
    }
  }, [selectedData, reset, getValues])

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
                  readOnly
                  value={getGrade(watchApproaches?.[index]?.approachPercent)}
                />
              </Form.Group>
              {fields.length > 1 && (
                <Form.Group as={Col} controlId={`approaches[${index}].delete`}
                  className="d-flex align-items-center justify-content-center" xs="auto"
                >
                  <Button variant="danger" onClick={() => remove(index)}>Delete</Button>
                </Form.Group>
              )}
            </Row>
          ))}
          <Form.Group>
            <Button variant="primary" type="button" onClick={append}>Add Approach</Button>
          </Form.Group>
          <Form.Group as={Row} controlId="overallCoverage" className="mt-3">
            <Form.Label column xs="2">
              Overall Coverage
            </Form.Label>
            <Col xs="6">
              <Form.Control
                type="number"
                name="overallCoverage"
                defaultValue={overallCoverage}
                readOnly
              />
            </Col>
            <Col xs="4">
              <Form.Control
                name="overallCoverageGrade"
                value={getGrade(overallCoverage)}
                ref={register}
                readOnly
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