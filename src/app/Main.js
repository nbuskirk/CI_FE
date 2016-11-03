/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */

/* Base, React + MUI/ThemeProvider */
import React, {Component} from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

/* Components from MUI */
import { Dialog, Tabs, Tab, Subheader, MenuItem, Drawer, LeftNav, RaisedButton, FlatButton, Divider, AppBar, IconButton, IconMenu } from 'material-ui'
import { Table, TableBody, TableHeader, TableFooter, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

/* Icon Imports from MUI */
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { NavigationClose, ActionAndroid, ActionVisibility } from 'material-ui/svg-icons';
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
const companyData = [
  {
    name: 'NRB Enterprises',
    modified: '06/25/2013',
    function: 'Media Group',
    notes: 'N/A',
    assignedto: 'Nathan Buskirk'
  }
]

export default class Main extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);

    this.state = {
      dialogopen: false,
      open: false,
      modalopen: false,
      projectData: []
    };
  }
  componentDidMount(){
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
  _onRowSelection(selectedRows){
    console.log(selectedRows)
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
      padding: '15px'
    }
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <AppBar onLeftIconButtonTouchTap={this.handleTouchTap} style={{textAlign:'center'}} title="TheCreativeIndex" /> 
            <Tabs>
              <Tab label="Projects">
                <Table selectable={true} fixedHeader={true} multiSelectable={true} onRowSelection={this._onRowSelection} >
                  <TableHeader enableSelectAll={true} displaySelectAll={true} adjustForCheckbox={true} >
                    <TableRow>
                      <TableHeaderColumn tooltip="Project ID">ID</TableHeaderColumn>
                      <TableHeaderColumn tooltip="Project Title">Title</TableHeaderColumn>
                      <TableHeaderColumn tooltip="View Project">View</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody showRowHover={!this.state.showRowHover} deselectOnClickaway={true} stripedRows={true}>
                    {this.state.projectData.map((row,index) => (
                      <TableRow key={index} selected={row.selected} >
                        <TableRowColumn>{row._id}</TableRowColumn>
                        <TableRowColumn>{row.date}</TableRowColumn>
                        <TableRowColumn><FlatButton label="View" onTouchTap={this.handleDialogOpen} data-index={index} icon={<ActionVisibility color={darkBlack} />} /></TableRowColumn>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table> 
              </Tab>
              <Tab label="Companies" >
                <Table selectable={true} fixedHeader={true} multiSelectable={true} height={'750px'} >
                  <TableHeader enableSelectAll={true} displaySelectAll={true} adjustForCheckbox={true} >
                    <TableRow>
                      <TableHeaderColumn tooltip="Modified Date">Modified</TableHeaderColumn>
                      <TableHeaderColumn tooltip="Company Name">Company</TableHeaderColumn>
                      <TableHeaderColumn tooltip="Business Function">Function</TableHeaderColumn>
                      <TableHeaderColumn tooltip="Notes">Notes</TableHeaderColumn>
                      <TableHeaderColumn tooltip="Assigned To">Assigned to</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody showRowHover={!this.state.showRowHover} deselectOnClickaway={true} stripedRows={true}>
                    {companyData.map((row,index) => (
                      <TableRow key={index} selected={row.selected}>
                        <TableRowColumn>{row.modified}</TableRowColumn>
                        <TableRowColumn>{row.name}</TableRowColumn>
                        <TableRowColumn>{row.function}</TableRowColumn>
                        <TableRowColumn>{row.notes}</TableRowColumn>
                        <TableRowColumn>{row.assignedto}</TableRowColumn>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableHeaderColumn tooltip="Modified Date">Modified</TableHeaderColumn>
                      <TableHeaderColumn tooltip="Project Name">Project</TableHeaderColumn>
                      <TableHeaderColumn tooltip="Project Status">Status</TableHeaderColumn>
                      <TableHeaderColumn tooltip="Assigned To">Assigned to</TableHeaderColumn>
                    </TableRow>
                  </TableFooter>
                </Table>
              </Tab>
            </Tabs>              
          <Drawer open={this.state.open} docked={false} onRequestChange={(open) => this.setState({open})} >
            <MenuItem>About</MenuItem>
            <MenuItem>Why?</MenuItem>
            <MenuItem>Pricing & Sign Up</MenuItem>
            <MenuItem>Contact Us</MenuItem>
          </Drawer>
          <Dialog title="Company Details" open={this.state.dialogopen} modal={false} onRequestClose={this.handleDialogClose} >
            <p>compknee details here!</p>
          </Dialog>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
