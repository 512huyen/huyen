import React from 'react';
import { connect } from 'react-redux';

const AuthorizationComponent = (WrappedComponent, allowedRoles) => {
    return class Authorization extends React.Component {
        constructor(props) {
            super(props)
        }
        render() {
            if (!allowedRoles || allowedRoles.length == 0) {
                return <WrappedComponent {...this.props} />
            } else {
                return <h1>No page for you!</h1>
            }
        }
    }
}

function mapStateToProps(state) {
    return {
      userApp: state.userApp
    };
  }
  
export default connect()(AuthorizationComponent);