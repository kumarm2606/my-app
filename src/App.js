import './App.css';
import React from 'react';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { Button, Modal, ModalHeader, ModalBody, Table, Label, FormGroup, Col, UncontrolledTooltip, Dropdown } from 'reactstrap';
import DatePicker from "react-datepicker";
import { Formik, Form, Field } from 'formik';
import "react-datepicker/dist/react-datepicker.css";
import * as Yup from 'yup';
function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [day, month, year].join('-');
}
function App() {
  const [EventcheckedList, setEventcheckedList] = useState([])
  const [EventList, setEventList] = useState([]);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [index, setIndex] = useState(null);
  const [userEvent, setUserEvent] = useState({
    eventname: "",
    eventdescription: "",
    startDate: new Date(),
    category:"options"
  })
  const optionList=[
   "item1",
   "item2",
   "item3"
]
  const CloseModal = () => {
    setModal(!modal)
    setUserEvent({
      eventname: "",
      eventdescription: "",
      startDate: new Date(),
      category:"options"
    })
  }
  const submit = (data, { resetForm }) => {
    let list = [...EventList]
    let filterList = list.filter((el) => {
      return el.eventname === data.eventname
    })
    if (!edit && filterList.length > 0) {
      alert("Event is Already Existing ")
    } else if (edit) {
      list.splice(index, 1, data);
      setEventList(list);
      resetForm();
      CloseModal();
      setUserEvent({
        eventname: "",
        eventdescription: "",
        startDate: new Date(),
        category:"options"
      })
      setEdit(false)
    } else {
      list.push(data);
      setEventList(list);
      resetForm();
      CloseModal();
    }

  }
  const DisplayingErrorMessagesSchema = Yup.object().shape({
    eventname: Yup.string().required('Event Name Required'),
    eventdescription: Yup.string().required('Event Description Required'),
  });
  const handalcheck = (e, data) => {
    let check = e.target.checked
    let list = [...EventcheckedList]
    if (check) {
      list.push(data);
      setEventcheckedList(list)
    } else {
      let index = list.findIndex((x) => x === data);
      list.splice(index, 1)
      setEventcheckedList(list)
    }
  }
  const handalEdit = (i) => {
    setUserEvent(EventList[i])
    setModal(true)
    setEdit(true)
    setIndex(i)
  }
  const handalDelete = (i) => {
    let list = [...EventList]
    list.splice(i, 1)
    setEventList(list)
  }
  return (
    <div className="App">
      <h1>Event Management</h1>
      <div className='d-flex' style={{ flexDirection: "row", justifyContent: "end" }}>
        <div><Button color="secondary" onClick={CloseModal}>Add event</Button></div>
      </div>
      <Modal isOpen={modal} toggle={CloseModal}>
        <ModalHeader toggle={CloseModal}> {edit ? "Edit Event" : "Add Event"} </ModalHeader>
        <Formik
          initialValues={userEvent}
          validationSchema={DisplayingErrorMessagesSchema}
          onSubmit={submit}
        >
          {({ errors, values, touched, setFieldValue }) => (
            <ModalBody>
              <Form>
              <select onChange={(e)=>{setFieldValue("category",e.target.value);setUserEvent({...userEvent,category:e.target.value})} } value={userEvent.category} >
                 {optionList && optionList.map((data)=>{
                  return (<option  value={data}>{data}</option>)
                  })} </select>
                <FormGroup row>
              
                  <Label
                    for="exampleEmail"
                    size="lg"
                    sm={4}
                  >
                    Event Name
                  </Label>
                  <Col sm={8}>
                    <Field name="eventname" onChange={(e) => setFieldValue('eventname', e.target.value)} />
                    <br />
                    {touched.eventname && errors.eventname && <span className='danger'>{errors.eventname}</span>}
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label
                    for="exampleEmail"
                    size="lg"
                    sm={4}
                  >
                    Event Description
                  </Label>
                  <Col sm={8}>
                    <Field name="eventdescription" as="textarea" onChange={(e) => setFieldValue('eventdescription', e.target.value)} />
                    <br />
                    {touched.eventdescription && errors.eventdescription && <span className='danger'>{errors.eventdescription}</span>}
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label
                    for="exampleEmail"
                    size="lg"
                    sm={4}>
                    Event Date
                  </Label>
                  <Col sm={8}>
                    <DatePicker name="startDate" selected={values.startDate}
                      onChange={(date) => { setFieldValue('startDate', date) }} minDate={new Date()} />
                  </Col>
                </FormGroup>
                <div className='text-right' style={{ textAlign: 'right' }}>
                  <Button type="submit" color='primary'>Submit</Button>
                </div>
              </Form>
            </ModalBody>
          )}
        </Formik>
      </Modal>
      <div style={{ height: "270px", overflow: "auto" }}>
        <Table bordered>
          <thead>
            <tr>
              <th>
                #
              </th>
              <th>
                Category
              </th>
              <th>
                Event Name
              </th>
              <th>
                Event Description
              </th>
              <th>
                Event Date
              </th>
              <th>
                Activity
              </th>
            </tr>
          </thead>
          {EventList.length > 0 ?
            EventList.map((data, i) => {
              return (
                <tbody>
                  <tr key={i}>
                    <th scope='row'><input type='checkbox' onChange={(e) => handalcheck(e, data)} /></th>
                    <td>{data.category}</td>
                    <td >{data.eventname}</td>
                    <td style={{ width: "250px" }} id={`decription-${i}`}><p className='eventdescription' >{data.eventdescription}</p></td>
                    {data.eventdescription.length > 200 && <UncontrolledTooltip autohide={true} placement="left" target={`decription-${i}`}>{data.eventdescription}</UncontrolledTooltip>}
                    <td>{formatDate(data.startDate)}</td>
                    <td><Button color="success" onClick={() => handalEdit(i)}>Edit</Button>{' '}<Button color="danger" onClick={() => handalDelete(i)}>Delete</Button></td>
                  </tr>

                </tbody>
              )
            }) : <tbody><tr><td colSpan='5'>No Record Found</td></tr></tbody>}
        </Table>
      </div>
      {EventcheckedList.length > 0 && <Table bordered>
        <thead>
          <tr>
            <th>
              Event Name
            </th>
            <th>
              Event Description
            </th>
            <th>
              Event Date
            </th>
          </tr>
        </thead>
        {EventcheckedList.map((data, i) => {
          return (
            <tbody>
              <tr key={i}>
                <td >{data.eventname}</td>
                <td style={{ width: "250px" }} id={`decriptionchild-${i}`}><p className='eventdescription' >{data.eventdescription}</p></td>
                {data.eventdescription.length > 200 && <UncontrolledTooltip autohide={true} placement="left" target={`decriptionchild-${i}`}>{data.eventdescription}</UncontrolledTooltip>}
                <td>{formatDate(data.startDate)}</td>
              </tr>
            </tbody>

          )
        }
        )
        }

      </Table>}



    </div>

  );
}

export default App;
