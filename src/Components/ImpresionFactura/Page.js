import React, { Component } from "react";
 

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div dangerouslySetInnerHTML={{ __html: this.props.datos }} />;
  }
}

export default Page;
