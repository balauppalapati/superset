/* eslint camelcase: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';
import { sectionsToRender } from '../stores/visTypes';
import ControlPanelSection from './ControlPanelSection';
import ControlRow from './ControlRow';
import Control from './Control';
//import controls from '../stores/controls';
import controls from '../stores/controls_extended';
import * as actions from '../actions/exploreActions';

const propTypes = {
  actions: PropTypes.object.isRequired,
  alert: PropTypes.string,
  datasource_type: PropTypes.string.isRequired,
  exploreState: PropTypes.object.isRequired,
  controls: PropTypes.object.isRequired,
  form_data: PropTypes.object.isRequired,
  isDatasourceMetaLoading: PropTypes.bool.isRequired,
  y_axis_zero: PropTypes.any,
};

class ControlPanelsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.removeAlert = this.removeAlert.bind(this);
    this.getControlData = this.getControlData.bind(this);
  }
  getControlData(controlName) {
    const mapF = controls[controlName].mapStateToProps;
    if (mapF) {
      return Object.assign({}, this.props.controls[controlName], mapF(this.props.exploreState));
    }
    return this.props.controls[controlName];
  }
  sectionsToRender() {
    return sectionsToRender(this.props.form_data.viz_type, this.props.datasource_type);
  }
  removeAlert() {
    this.props.actions.removeControlPanelAlert();
  }
  render() {
    return (
      <div className="scrollbar-container">
        <div className="scrollbar-content p-b-30">
          {this.props.alert &&
            <Alert bsStyle="warning">
              {this.props.alert}
              <i
                className="fa fa-close pull-right"
                onClick={this.removeAlert}
                style={{ cursor: 'pointer' }}
              />
            </Alert>
          }
          {this.sectionsToRender().map((section,index) => (
            <ControlPanelSection
              key={section.label}
              label={section.label}
              tooltip={section.description}
              index = {index}
            >
              {section.controlSetRows.map((controlSets, i) => (
                <ControlRow
                  key={`controlsetrow-${i}`}
                  controls={controlSets.map(controlName => (
                    <Control
                      name={controlName}
                      key={`control-${controlName}`}
                      value={this.props.form_data[controlName]}
                      validationErrors={this.props.controls[controlName].validationErrors}
                      actions={this.props.actions}
                      {...this.getControlData(controlName)}
                    />
                  ))}
                />
              ))}
            </ControlPanelSection>
          ))}
        </div>
      </div>
    );
  }
}

ControlPanelsContainer.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    alert: state.controlPanelAlert,
    isDatasourceMetaLoading: state.isDatasourceMetaLoading,
    controls: state.controls,
    exploreState: state,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export { ControlPanelsContainer };

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanelsContainer);
