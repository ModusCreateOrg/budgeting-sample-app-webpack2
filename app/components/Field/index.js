import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import isObject from 'utils/isObject';

/**
 * `Field` component.
 *
 * Used to connect any form field to the form data generated by the Form component.
 *
 * The prop `component` can be a Component, a stateless function component, or
 * a string for DOM form fields (`input`, `select`). This is the component that will
 * be rendered.
 */
class Field extends React.Component {
  static propTypes = {
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    name: PropTypes.string.isRequired,
    handleRef: PropTypes.func,
  };

  static defaultProps = {
    component: 'input',
    handleRef: null,
  };

  static contextTypes = {
    formDataBroadcast: PropTypes.object,
  };

  state = {
    field: {},
  };

  componentWillMount() {
    const { formDataBroadcast } = this.context;

    // set initial data from the form data broadcast
    const initialFormData = formDataBroadcast.getState();
    this.updateFieldState(initialFormData);
  }

  componentDidMount() {
    const { formDataBroadcast } = this.context;

    // subscribe to the form data broadcast
    this.unsubscribe = formDataBroadcast.subscribe(this.updateFieldState);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  /**
   * Return a field value from a SyntheticEvent or a value
   */
  getValue = eventOrValue => {
    if (!isObject(eventOrValue)) return eventOrValue;

    const target = eventOrValue.target;
    if (target) {
      const type = target.type;
      if (type === 'checkbox') {
        return target.checked || '';
      }
      return target.value;
    }
    return eventOrValue;
  };

  updateFieldState = formData => {
    const { name } = this.props;

    const fieldData = formData.fields[name];
    this.setState({ field: fieldData });
  };

  /**
   * Handle change from the underlying component
   */
  handleChange = eventOrValue => {
    const { field } = this.state;

    if (field) {
      const value = this.getValue(eventOrValue);
      field.onChange(value);
    }
  };

  render() {
    const { component, name, handleRef, ...otherProps } = this.props;
    const { field } = this.state;

    // form-related props
    let customProps = {
      name,
      value: '',
      onChange: this.handleChange,
      ref: handleRef,
    };

    // form-related props that might cause an "unknown prop" warnings
    let extraProps = {};

    customProps = {
      ...customProps,
      value: field.value,
      onBlur: field.onBlur,
    };

    extraProps = {
      ...extraProps,
      blurred: field.blurred,
      error: field.error,
      initialValue: field.initialValue,
    };

    if (typeof component === 'string') {
      // don't pass extra props if component is a string, because
      // it can trigger "unknown prop" warnings
      return createElement(component, { ...customProps, ...otherProps });
    }
    return createElement(component, { ...customProps, ...extraProps, ...otherProps });
  }
}

export default Field;
