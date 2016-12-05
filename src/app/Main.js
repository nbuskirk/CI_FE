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
import { Dialog, Tabs, Tab, Subheader, MenuItem, Drawer, LeftNav, FlatButton, Divider, AppBar, IconButton, IconMenu, Snackbar } from 'material-ui'
import { Table, TableBody, TableHeader, TableFooter, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

/* Icon Imports from MUI */
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {fade} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

/* Theme definitons for app / overrides */
import {
  grey100, grey400, grey700, grey900,
  purple100, purpleA100, pinkA700, darkBlack, fullBlack, white, blueA700, pink400, pink100, indigo900,
} from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: grey900,
    accent1Color: pink400,
    accent2Color: pink400,
    accent3Color: pink400,
    textColor: grey900,
    alternateTextColor: white,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: grey900,
    shadowColor: fullBlack
  },
  checkbox: {
    //boxColor: pinkA700,
    //checkedColor: purple100,
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
      dataSource: [],
      modalData: {
        title: 'test',
        date: 'no'
      }
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
  handleDialogOpen(id){
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
  fetchModalData(id){
    fetch('http://localhost:8080/project/'+id, {
      method: 'GET'
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
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

    const styles = {
      margin: 0,
      padding: '45px 25px',
      background: pink100
    }

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <AppBar onLeftIconButtonTouchTap={this.handleTouchTap} /> 
            <div style={styles}>
              <h2>Project List</h2>
              <p>This can be any subtext, or a sub-heading</p>
            </div>
            <Tabs>
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
                          <TableRowColumn><a href="#" data-id={row._id} onClick={this.handleDialogOpen(row._id)}>{row.name}</a></TableRowColumn>
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
            <p>{this.state.modalData.title}</p>
          </Dialog>
          <div style={{marginTop:'5px', textAlign:'center'}} >
            <p>featured footer text here</p>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
