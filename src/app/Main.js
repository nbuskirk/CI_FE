/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */

/* Base, React + MUI/ThemeProvider */
import React, {Component} from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import styles from './styles.less'

/* Components from MUI */
import { Dialog, Tabs, Tab, Subheader, MenuItem, Drawer, LeftNav, RaisedButton, FlatButton, Divider, AppBar, IconButton, IconMenu, Snackbar, FloatingActionButton } from 'material-ui'
import { Table, TableBody, TableHeader, TableFooter, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';

/* Icon Imports from MUI */
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { NavigationClose, ActionAndroid, ActionVisibility, ActionDelete, ContentAdd, ContentRemove } from 'material-ui/svg-icons';
import {fade} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

/* Theme definitons for app / overrides */
import { 
  cyan500, blue500, grey100, grey500, blue100, blue700, purple100, darkBlack, 
  fullBlack, pink500, pink700, pinkA200, deepPurple500, white, grey300, indigoA100 
} from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: blue700,
    primary2Color: blue700,
    primary3Color: blue700,
    accent1Color: pinkA200,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: grey500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack
  },
  checkbox: {
    boxColor: pink500,
    checkedColor: pink700,
  }
});

export default class Main extends React.Component {
 
  constructor(props, context) {
   
    super(props, context);
   
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.state = {
      dialogopen: false,
      open: false,
      modalopen: false,
      projectData: [],
      snackOpen: false,
      dataSource: []
    };

  }
  componentDidMount(){
    this.fetchData();
  }
  handleRequestClose() {
    this.setState({
      open: false,
    });
  }
  handleDialogOpen(event){
    this.setState({
      dialogopen: true
    })
  }
  handleDialogClose(){
    this.setState({
      dialogopen: false
    })
  }
  handleTouchTap() {
    this.setState({
      open: true,
    });
  }
  onRowSelection(selectedRows){

  }
  fetchData(){
    fetch('http://localhost:8080/project', {
      method: 'GET'
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      this.setState({projectData: data})
    })
    .catch((err) => {
      console.log(err);
    })
  }
  handleDelete(e){
    /* This is a reducer.. or it will be. Reduce the state by 1 project and send back a new state */
    const id = e.currentTarget.dataset.id;
    if( confirm('Delete: '+id+' ?') ) {
      fetch('http://localhost:8080/project/'+id, {
        method: 'DELETE'
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if(data.message==='Project deleted') {
          let item = this.state.projectData.find(function(o){
            return o._id === id
          })
          const index = this.state.projectData.indexOf(item);
          this.setState({
            projectData: this.state.projectData.filter((_,i) => i !== index)
          })
        }
      })
      .catch((err) => {
        console.log(err);
      })
    } else {
      //do nothing
    }
  }
 
  render() {
   
    const standardActions = (
       <MuiThemeProvider muiTheme={muiTheme}>
        <FlatButton
          label="Ok"
          primary={true}
          onTouchTap={this.handleRequestClose}
        />
      </MuiThemeProvider>
    );

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <AppBar onLeftIconButtonTouchTap={this.handleTouchTap} /> 
            <h2 style={{background:'skyblue', margin:0, padding:'45px', color:white}}>Project List</h2>
            <Tabs>
              <Tab label="Create">
                <div style={{padding:'15px', fontSize:'16px' }}>
                 <form>
                  <TextField id="text-field-default" defaultValue="" fullWidth={true} floatingLabelText="Project Name"/>
                  <DatePicker hintText="Date" floatingLabelText="Date" fullWidth={true} />
                  <TextField id="text-field-default" defaultValue="" fullWidth={true} floatingLabelText="Keywords"/>
                  <FlatButton label="Submit" primary={true} />
                 </form>
                </div>
              </Tab>
              <Tab label="List">
                <Table selectable={true} fixedHeader={true} multiSelectable={true} onRowSelection={this.onRowSelection} >
                  <TableHeader enableSelectAll={true} displaySelectAll={true} adjustForCheckbox={true} >
                    <TableRow>
                      <TableHeaderColumn tooltip="Project Name">Name</TableHeaderColumn>
                      <TableHeaderColumn tooltip="Project ID">ID</TableHeaderColumn>                     
                      <TableHeaderColumn tooltip="Project Date">Date</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody showRowHover={!this.state.showRowHover} deselectOnClickaway={true} stripedRows={true}>
                    {this.state.projectData.map((row,index) => (
                        <TableRow key={index} selected={row.selected} >
                          <TableRowColumn><a href="#">{row.name}</a></TableRowColumn>
                          <TableRowColumn>{row._id}</TableRowColumn>
                          <TableRowColumn>{row.date}</TableRowColumn>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table> 
              </Tab>
              <Tab label="Contact" >
                 <div style={{width:'70%', margin:'auto', padding:'15px', fontSize:'16px'}}>
                  <p>contact info.</p>
                </div>
              </Tab>
            </Tabs>
          <Snackbar open={this.state.snackOpen} message="test" autoHideDuration={8000} onRequestClose={this.handleRequestClose} />
          <Drawer open={this.state.open} docked={false} onRequestChange={(open) => this.setState({open})} >
             <Subheader>Navigation</Subheader>
             <Divider />
            <MenuItem>Create / New</MenuItem>
            <MenuItem>Read / List</MenuItem>
            <MenuItem>Update / Edit</MenuItem>
          </Drawer>
          <Dialog title="Company Details" open={this.state.dialogopen} modal={false} onRequestClose={this.handleDialogClose} >
            <p>project details here!</p>
          </Dialog>
          <div style={{textAlign:'center'}} >
            <Divider />
            <p style={{color:grey500, fontSize:'12px'}}>made with: es6/js, react, webpack, npm, material ui</p>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
