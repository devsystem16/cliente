import React, { Component } from "react";


class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
 
  }


  render() {
    return <div dangerouslySetInnerHTML={{ __html: this.props.datos }} />;
  }
}

export default Page;
