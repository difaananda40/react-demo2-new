import React, { Fragment, useEffect, useState, useCallback, useRef } from 'react';
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
import usersJson from '../../Dummy/ic4pro_users.json';
import coveragesJson from '../../Dummy/ic4pro_auditCoverage.json';
import designatesJson from '../../Dummy/ic4pro_designates.json';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const StepThree = () => {
  const { register, errors, control, getValues, reset, selectedData, mode } = useFormContext();

  const { fields: auditTeamsFields, append: auditTeamsAppend, remove: auditTeamsRemove } = useFieldArray({
    control,
    name: "auditTeams"
  });

  const { fields: reviewersFields, append: reviewersAppend, remove: reviewersRemove } = useFieldArray({
    control,
    name: "reviewers"
  });

  const [ coverages, setCoverages ] = useState([...coveragesJson]);

  const isInitiated = useRef(false);

  useEffect(() => {
    if(mode === 'create') {
      reset({
        ...getValues(),
        auditTeams: [{}],
        reviewers: [{}],
        approver: null
      })
    }
  }, [getValues, mode, reset])

  useEffect(() => {
    if(!isInitiated.current && selectedData && (mode !== 'create' || mode === null)) {
      reset({
        ...getValues(),
        auditTeams: selectedData.auditTeam.map(at => ({
          auditorId: usersJson.find(uj => uj.userid === at.auditorId),
          coverages: at.specificCoverage.map(sc => (coverages.find(cv => sc.areaInspected === cv.key)))
        })),
        reviewers: selectedData.reviewers.map(rv => ({
          reviewer: usersJson.find(uj => uj.userid === rv.reviewer)
        })),
        approver: usersJson.find(uj => uj.userid === selectedData.approver)
      })
      isInitiated.current = true;
    }
  }, [selectedData, reset, getValues, mode, coverages])

  const watchAuditTeams = useWatch({ name: 'auditTeams' });
  const watchReviewers = useWatch({ name: 'reviewers' });
  const watchApprover = useWatch({ name: 'approver' });

  const prevWatchAuditTeams = usePrevious(watchAuditTeams);

  // Disable selected option on next select
  useEffect(() => {
    if(watchAuditTeams && !compare(watchAuditTeams, prevWatchAuditTeams)) {    
      setCoverages(prevCoverages => {
        let selectedCoverages = [];
        watchAuditTeams.forEach(wat => wat.coverages?.forEach(cv => selectedCoverages.push(cv.key)))
        const newCoverages = prevCoverages?.map(cv => ({ ...cv, isDisabled: selectedCoverages.includes(cv.key) }))
        return newCoverages;
      })
    }
  }, [prevWatchAuditTeams, watchAuditTeams])

  const getDesignate = useCallback((designate) => {
    const designateFind = designatesJson.find(de => de.designate_id === designate)
    return designateFind?.designate_name;
  }, []);

  return (
    <Fragment>
      <Card>
        <Card.Header className="font-weight-bold" style={{ backgroundColor: '#FFC107' }}>
          Inspection Team
        </Card.Header>
        <Card.Body>
          {auditTeamsFields.map((item, index) => (
            <Row key={item.id}>
              <Col xs="12">
                <h5>Inspector {index + 1}</h5>
              </Col>
              <Col>
                <Row>
                  <Form.Group as={Col} controlId={`auditTeams[${index}].auditorId`}>
                    <Form.Label>
                      Auditor Name*
                    </Form.Label>
                    <Controller
                      name={`auditTeams[${index}].auditorId`}
                      as={Select}
                      options={usersJson}
                      control={control}
                      getOptionValue={option => option.userid}
                      getOptionLabel={option => `${option.title}. ${option.firstName} ${option.lastNamme}`}
                      rules={{ required: 'Auditor is required!' }}
                      isInvalid={errors.auditTeams?.[index]?.auditorId}
                      disabled={mode === 'view' || mode === 'delete'}
                      defaultValue={item.auditorId || ""}
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId={`auditTeams[${index}].auditorRole`}>
                    <Form.Label>
                      Auditor Role
                    </Form.Label>
                    <Form.Control
                      name={`auditTeams[${index}].auditorRole`}
                      ref={register}
                      readOnly
                      defaultValue={getDesignate(watchAuditTeams?.[index]?.auditorId?.designate)} />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col} controlId={`auditTeams[${index}].coverages`}>
                    <Form.Label>
                      Inspected Area*
                    </Form.Label>
                    <Controller
                      name={`auditTeams[${index}].coverages`}
                      as={Select}
                      options={coverages}
                      control={control}
                      getOptionValue={option => option.key}
                      getOptionLabel={option => option.description}
                      rules={{ required: 'Inspection Area is required!' }}
                      isInvalid={errors.auditTeams?.[index]?.coverages}
                      isMulti
                      hideSelectedOptions={false}
                      disabled={mode === 'view' || mode === 'delete'}
                      defaultValue={item.coverages}
                    />
                  </Form.Group>
                </Row>
              </Col>
              {(mode === 'create' || mode === 'edit') && auditTeamsFields.length > 1 && (
                <Form.Group as={Col} controlId={`auditTeams[${index}].delete`}
                  className="d-flex align-items-center justify-content-center" xs="auto"
                >
                  <Button variant="danger" onClick={() => auditTeamsRemove(index)}>Delete</Button>
                </Form.Group>
              )}
            </Row>
          ))}
          {(mode === 'create' || mode === 'edit') && (
            <Form.Group>
              <Button variant="primary" type="button" onClick={auditTeamsAppend}>Add Inspector</Button>
            </Form.Group>
          )}
        </Card.Body>
      </Card>
      <Card className="mt-3">
        <Card.Header className="font-weight-bold" style={{ backgroundColor: '#FFC107' }}>
          Reviewers
        </Card.Header>
        <Card.Body>
          {reviewersFields.map((item, index) => (
            <Row key={item.id}>
              <Form.Group as={Col} controlId={`reviewers[${index}].reviewer`}>
                <Form.Label>
                  Reviewer {index + 1}*
                </Form.Label>
                <Controller
                  name={`reviewers[${index}].reviewer`}
                  as={Select}
                  options={usersJson}
                  control={control}
                  getOptionValue={option => option.userid}
                  getOptionLabel={option => `${option.title}. ${option.firstName} ${option.lastNamme}`}
                  rules={{ required: 'Reviewer is required!' }}
                  isInvalid={errors.reviewers?.[index]?.reviewer}
                  disabled={mode === 'view' || mode === 'delete'}
                  defaultValue={item.reviewer || ""}
                />
              </Form.Group>
              <Form.Group as={Col} controlId={`reviewers[${index}].reviewerRole`}>
                <Form.Label>
                  Reviewer Role
                </Form.Label>
                <Form.Control
                  name={`reviewers[${index}].reviewerRole`}
                  ref={register}
                  readOnly
                  defaultValue={getDesignate(watchReviewers?.[index]?.reviewer?.designate)} />
              </Form.Group>
              {(mode === 'create' || mode === 'edit') && reviewersFields.length > 1 && (
                <Form.Group as={Col} controlId={`reviewers[${index}].delete`}
                  className="d-flex align-items-center justify-content-center" xs="auto"
                >
                  <Button variant="danger" onClick={() => reviewersRemove(index)}>Delete</Button>
                </Form.Group>
              )}
            </Row>
          ))}
          {(mode === 'create' || mode === 'edit') && (
            <Form.Group>
              <Button variant="primary" type="button" onClick={reviewersAppend}>Add Reviewer</Button>
            </Form.Group>
          )}
          <Row>
            <Form.Group as={Col} controlId="approver">
              <Form.Label>
                Approver
              </Form.Label>
              <Controller
                name="approver"
                as={Select}
                options={usersJson}
                control={control}
                getOptionValue={option => option.userid}
                getOptionLabel={option => `${option.title}. ${option.firstName} ${option.lastNamme}`}
                rules={{ required: 'Approver is required!' }}
                isInvalid={errors.approver}
                disabled={mode === 'view' || mode === 'delete'}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="approverRole">
              <Form.Label>
                Approver Role
              </Form.Label>
              <Form.Control
                name="approverRole"
                ref={register}
                readOnly
                defaultValue={getDesignate(watchApprover?.designate)} />
            </Form.Group>
          </Row>
        </Card.Body>
      </Card>
    </Fragment>
  )
}

function compare(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export default React.memo(StepThree, compare);