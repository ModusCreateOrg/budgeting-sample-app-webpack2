import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import isObject from 'utils/isObject';
import consumeContextBroadcast from 'utils/consumeContextBroadcast';

/**
 * `Field` component.
 *
 * Used to connect any form field to the form data generated by the Form component.
 *
 * The prop `component` can be a Component, a stateless function component, or
 * a string for DOM form fields (`input`, `select`). This is the component that will
 * be rendered.
 */
@consumeContextBroadcast('formData')
class Field extends React.Component {
  static propTypes = {
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    name: PropTypes.string.isRequired,
    handleRef: PropTypes.func,
    formData: PropTypes.object.isRequired,
  };

  static defaultProps = {
    component: 'input',
    handleRef: null,
  };

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

  getFieldData = () => {
    const { name, formData } = this.props;

    return formData.fields[name];
  };

  /**
   * Handle change from the underlying component
   */
  handleChange = eventOrValue => {
    const field = this.getFieldData();

    if (field) {
      const value = this.getValue(eventOrValue);
      field.onChange(value);
    }
  };

  render() {
    const { component, name, handleRef, formData, ...otherProps } = this.props;
    const field = this.getFieldData();

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
