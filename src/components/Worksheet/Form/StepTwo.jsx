import React, { Fragment, useEffect, useState, useRef } from 'react';
import { useFormContext, Controller, useFieldArray, useWatch } from "react-hook-form";
import {
  Form,
  Row,
  Col,
  Card,
  Button
} from 'react-bootstrap';
import Select from "../../Shared/Select";
import Datepicker from "../../Shared/Datepicker";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const StepTwo = () => {
  const { register, errors, control, getValues, reset, mode, methods, datas } = useFormContext();
  const {
    usersJson,
    jobStayMonths,
    jobStayYears
  } = datas;
  const {
    getDesignate
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "keyOfficers"
  });

  const [ users, setUsers ] = useState([...usersJson]);

  const watchKeyOfficers = useWatch({ name: 'keyOfficers' });
  const prevWatchKeyOfficers = usePrevious(watchKeyOfficers);

  // Disable selected option on next select
  useEffect(() => {
    if(watchKeyOfficers && !compare(watchKeyOfficers, prevWatchKeyOfficers)) {
      setUsers(prevUsers => {
        const newWatchKeyOfficers = watchKeyOfficers.map(ko => ko.staffName?.userid);
        const newUsers = prevUsers?.map(u => ({ ...u, isDisabled: newWatchKeyOfficers.includes(u.userid) }))
        return newUsers;
      })
    }
  }, [prevWatchKeyOfficers, watchKeyOfficers])

  const watchBranchId = useWatch({ name: 'branchId' });
  const prevWatchBranchId = usePrevious(watchBranchId);

  useEffect(() => {
    const branchId = watchBranchId?.branchId;
    setUsers(prevUsers => prevUsers.filter(pu => pu.branchId === branchId));
    if(watchBranchId && prevWatchBranchId && !compare(watchBranchId, prevWatchBranchId)) {
      reset({
        ...getValues(),
        keyOfficers: [{}]
      }, {
        errors: true, // errors will not be reset 
        dirtyFields: true, // dirtyFields will not be reset
        isDirty: true, // dirty will not be reset
      })
    }
  }, [append, getValues, prevWatchBranchId, reset, watchBranchId])

  return (
    <Fragment>
      <Card>
        <Card.Header className="font-weight-bold" style={{ backgroundColor: '#FFC107' }}>
          Key Officers
        </Card.Header>
        <Card.Body>
          <Row>
            <Form.Group as={Col}  >
              <Form.Label htmlFor="keyofficer">
                Staff Name
              </Form.Label>
            </Form.Group>
            <Form.Group as={Col}  >
              <Form.Label htmlFor="gradelevel">
                Grade Level
              </Form.Label>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </Form.Group>
            <Form.Group as={Col}  >
              <Form.Label htmlFor="" style={{textJustify:"inherit"}}>
                Function
              </Form.Label>
            </Form.Group>
            <Form.Group as={Col}  >
              <Form.Label htmlFor="" style={{textJustify:"inherit"}}>
                Length Of Stay
              </Form.Label>
            </Form.Group>
            <Form.Group as={Col}  >
              <Form.Label htmlFor="">
                Job Stay Year
              </Form.Label>
            </Form.Group>
            <Form.Group as={Col}  >
              <Form.Label htmlFor="">
                Job Stay Month
              </Form.Label>
            </Form.Group>
          </Row>
          {fields.map((item, index) => (
            <Row key={item.id}>
              <Form.Group as={Col} sm="" controlId={`keyOfficers[${index}].staffName`}>
                
                <Controller
                  // id="keyofficer"
                  name={`keyOfficers[${index}].staffName`}
                  as={Select}
                  options={users}
                  control={control}
                  getOptionValue={option => option.userid}
                  getOptionLabel={option => `${option.title}. ${option.firstName} ${option.lastNamme}`}
                  rules={{ required: 'Staff Name is required!' }}
                  isInvalid={errors.keyOfficers?.[index]?.staffName}
                  disabled={mode === 'view' || mode === 'delete'}
                  defaultValue={item.staffName || ""}
                />
              </Form.Group>
              <Form.Group as={Col} controlId={`keyOfficers[${index}].gradeLevel`}>
                
                <Form.Control 
                // id="gradelevel"
                name={`keyOfficers[${index}].gradeLevel`} 
                ref={register} 
                disabled 
                defaultValue={watchKeyOfficers?.[index]?.staffName?.gradeLevel} />
              </Form.Group>
              <Form.Group as={Col} controlId={`keyOfficers[${index}].designate`}>
                
                <Form.Control
                  name={`keyOfficers[${index}].designate`}
                  ref={register}
                  disabled
                  defaultValue={getDesignate(watchKeyOfficers?.[index]?.staffName?.designate)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId={`keyOfficers[${index}].datejoin`}>
                
                <Controller
                  control={control}
                  name={`keyOfficers[${index}].datejoin`}
                  rules={{ required: 'Length of Stay is required!' }}
                  defaultValue={item.datejoin || ""}
                  render={({ onChange, onBlur, value }) => (
                    <Fragment>
                      <Datepicker
                        onChange={onChange}
                        onBlur={onBlur}
                        selected={value}
                        isInvalid={errors.keyOfficers?.[index]?.datejoin}
                        className="form-control is-invalid"
                        placeholderText="Length of Stay..."
                        disabled={mode === 'view' || mode === 'delete'}
                      />
                    </Fragment>
                  )}
                />
              </Form.Group>
              <Form.Group as={Col} controlId={`keyOfficers[${index}].jobStayYear`}>
                
                <Controller
                  name={`keyOfficers[${index}].jobStayYear`}
                  as={Select}
                  options={jobStayYears}
                  control={control}
                  rules={{ required: 'Job Stay Year is required!' }}
                  isInvalid={errors.keyOfficers?.[index]?.jobStayYear}
                  disabled={mode === 'view' || mode === 'delete'}
                  defaultValue={item.jobStayYear || ""}
                />
              </Form.Group>
              <Form.Group as={Col} controlId={`keyOfficers[${index}].jobStayMonth`}>
                
                <Controller
                  name={`keyOfficers[${index}].jobStayMonth`}
                  as={Select}
                  options={jobStayMonths}
                  control={control}
                  rules={{ required: 'Job Stay Month is required!' }}
                  isInvalid={errors.keyOfficers?.[index]?.jobStayMonth}
                  disabled={mode === 'view' || mode === 'delete'}
                  defaultValue={item.jobStayMonth || ""}
                />
              </Form.Group>
              {(mode === 'create' || mode === 'edit') && fields.length > 1 && (
                <Form.Group as={Col} controlId={`keyOfficers[${index}].delete`}
                  className="d-flex align-items-center justify-content-center" xs="auto"
                >
                  <Button variant="danger" onClick={() => remove(index)}>Delete</Button>
                </Form.Group>
              )}
            </Row>
          ))}
          {(mode === 'create' || mode === 'edit') && (
            <Form.Group>
              <Button variant="primary" type="button" onClick={append}>Add Staff</Button>
            </Form.Group>
          )}
        </Card.Body>
      </Card>
    </Fragment>
  )
}

function compare(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export default React.memo(StepTwo, compare);