import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
} from 'react-bootstrap';

// Components
import Form from '../../components/Worksheet/Form';
import Table from '../../components/Worksheet/Table';

import worksheets from '../../components/Dummy/ic4pro_auditworksheets.json';

const Worksheet = () => {
  const [ state, setState ] = useState({
    data: [...worksheets],
    showForm: false,
    selectedData: null,
    mode: null
  });

  // handleForm effect
  // useEffect(() => {
  //   return () => {
  //     setState(prev => ({
  //       ...prev,
  //       showForm: !prev.showForm,
  //     }))
  //   }
  // }, [state.mode])

  const handleForm = useCallback((event) => {
    const { name } = event.target;
    setState(prev => ({
      ...prev,
      mode: name || null,
      ...((!name || name === 'create') && {selectedData: null}),
      showForm: !prev.showForm
    }))
  }, []);

  const submitForm = useCallback((data, mode) => {
    if(mode === 'create') {
      setState(prev => ({
        ...prev,
        data: [
          data,
          ...prev.data
        ],
        selectedData: null
      }))
    }
    else if(mode === 'edit') {
      let newData = [...state.data];
      let editedDataId = newData.findIndex(dt => dt.worksheetId === data.worksheetId);
      newData[editedDataId] = data;
      setState(prev => ({
        ...prev,
        data: newData,
        selectedData: null
      }))
    }

    setState(prev => ({
      ...prev,
      showForm: false
    }))
  }, []);

  const selectData = useCallback((data) => {
    setState(prev => ({
      ...prev,
      selectedData: data
    }))
  }, []);

  const deleteData = useCallback((e) => {
    e.preventDefault();
    const { data, selectedData } = state;
    if(window.confirm('Are you sure to delete this data?')) {
      setState(prev => ({
        ...prev,
        data: [...data.filter(dt => dt.worksheetId !== selectedData.worksheetId)],
        selectedData: null,
        // showForm: false,
        mode: null,
      }))
    }
  }, []);

  return (
    <Container fluid className="p-4" style={{ backgroundColor: '#F2F2F2' }}>
      <Card>
        <Card.Body>
          <Row>
            <Col className="d-flex flex-row align-items-center">
              <h2>Worksheet</h2>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Button
                variant="info"
                size="sm"
                name="create"
                onClick={handleForm}
              >
                Create
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="ml-1"
                name="edit"
                disabled={!state.selectedData}
                onClick={handleForm}
              >
                Edit
              </Button>
              <Button
                variant="success"
                size="sm"
                className="ml-1"
                name="view"
                disabled={!state.selectedData}
                onClick={handleForm}
              >
                View
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="ml-1"
                name="delete"
                disabled={!state.selectedData}
                onClick={handleForm}
              >
                Delete
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table
                data={state.data}
                selectData={selectData}
                selectedData={state.selectedData}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Form
        show={state.showForm}
        handleForm={handleForm}
        submitForm={submitForm}
        mode={state.mode}
        selectedData={state.selectedData}
        deleteData={deleteData}
      />
    </Container>
  )
}

export default Worksheet;