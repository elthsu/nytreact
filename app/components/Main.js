// Include React
var React = require("react");
// Including the Link component from React Router to navigate within our application without full page reloads
var Link = require("react-router").Link;

// Create the Main component
var Main = React.createClass({


  getInitialState: function() {
    return {
      searchTerm: "",
      records: 1,
      startYear: 1900,
      endYear: 2017
    };
    this.handleClick = this.handleClick.bind(this);
    this.resetClick = this.resetClick.bind(this);
  },
  handleInputChange(event) {
    this.setState({ searchTerm: event.target.value });
  },
  handleRecordsChange(event) {
    this.setState({ records: event.target.value });
  },
  handleStartYearChange(event) {
    this.setState({ startYear: event.target.value });
  },
  handleEndYearChange(event) {
    this.setState({ endYear: event.target.value });
  },
  // Whenever the button is clicked we'll use setState to add to the clickCounter
  // Note the syntax for setting the state
  handleClick: function() {
    this.setState({
    searchTerm: this.state.searchTerm,
    records: this.state.records,
    startYear: this.state.startYear,
    endYear: this.state.endYear
    });
  },
  // Whenever the button is clicked we'll use setState to reset the clickCounter
  // This will reset the clicks -- and it will be passed  ALL children
  resetClick: function() {
    this.setState({
      searchTerm: "",
      records: 1,
      startYear: 1900,
      endYear: 2017 });
  },


  // Here we render the component
  render: function() {

    return (

    <div className="container">
      <div className="jumbotron" style={style}>
        <h1 className="text-center"><strong><i className="fa fa-newspaper-o"></i> New York Times Search</strong></h1>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <br />

          <div className="panel panel-primary">
            <div className="panel-heading">
              <h3 className="panel-title"><strong><i className="fa  fa-list-alt"></i>   Search Parameters</strong></h3>
            </div>
            <div className="panel-body">

              <form role="form">

                <div className="form-group">
                  <label htmlFor="search">Search Term:</label>
                  <input type="text" className="form-control" id="search-term" onChange={this.handleInputChange} value={this.state.searchTerm} />
                </div>

                <div className="form-group">
                  <label htmlFor="pwd">Number of Records to Retrieve:</label>
                  <select className="form-control" id="num-records-select" onChange={this.handleRecordsChange} value={this.state.records}>
  							<option value="1">1</option>
  							<option value="5">5</option>
  							<option value="10">10</option>
  						</select>
                </div>

                <div className="form-group">
                  <label htmlFor="start-year">Start Year (Optional):</label>
                  <input type="text" className="form-control" id="start-year" onChange={this.handleStartYearChange} value={this.state.startYear}/>
                </div>

                <div className="form-group">
                  <label htmlFor="end-year">End Year (Optional):</label>
                  <input type="text" className="form-control" id="end-year" onChange={this.handleEndYearChange} value={this.state.endYear}/>
                </div>

                <button type="submit" className="btn btn-default" id="run-search"><i className="fa fa-search" onClick={this.handleClick}></i> Search</button>
                <button type="button" className="btn btn-default" id="clear-all"><i className="fa fa-trash" onClick={this.resetClick}></i> Clear Results</button>

              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <br />
          <div className="panel panel-primary">


            <div className="panel-heading">
              <h3 className="panel-title"><strong><i className="fa fa-table"></i>   Top Articles</strong></h3>
            </div>

            <div className="panel-body" id="well-section">
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <hr />
        </div>
      </div>
    </div>

    );
  }
});

const style = {backgroundColor: "#20315A", color: "white"}

// Export the component back for use in other files
module.exports = Main;
