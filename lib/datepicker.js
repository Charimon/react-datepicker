'use strict';

var _date_input = require('./date_input');

var _date_input2 = _interopRequireDefault(_date_input);

var _calendar = require('./calendar');

var _calendar2 = _interopRequireDefault(_calendar);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _defer = require('lodash/defer');

var _defer2 = _interopRequireDefault(_defer);

var _tether_component = require('./tether_component');

var _tether_component2 = _interopRequireDefault(_tether_component);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _date_utils = require('./date_utils');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _reactOnclickoutside = require('react-onclickoutside');

var _reactOnclickoutside2 = _interopRequireDefault(_reactOnclickoutside);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var outsideClickIgnoreClass = 'react-datepicker-ignore-onclickoutside';
var WrappedCalendar = (0, _reactOnclickoutside2.default)(_calendar2.default);

/**
 * General datepicker component.
 */

var DatePicker = _react2.default.createClass({
  displayName: 'DatePicker',

  propTypes: {
    autoComplete: _react2.default.PropTypes.string,
    autoFocus: _react2.default.PropTypes.bool,
    calendarClassName: _react2.default.PropTypes.string,
    children: _react2.default.PropTypes.node,
    className: _react2.default.PropTypes.string,
    customInput: _react2.default.PropTypes.element,
    dateFormat: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.array]),
    dateFormatCalendar: _react2.default.PropTypes.string,
    disabled: _react2.default.PropTypes.bool,
    disabledKeyboardNavigation: _react2.default.PropTypes.bool,
    dropdownMode: _react2.default.PropTypes.oneOf(['scroll', 'select']).isRequired,
    endDate: _react2.default.PropTypes.object,
    excludeDates: _react2.default.PropTypes.array,
    filterDate: _react2.default.PropTypes.func,
    fixedHeight: _react2.default.PropTypes.bool,
    highlightDates: _react2.default.PropTypes.array,
    id: _react2.default.PropTypes.string,
    includeDates: _react2.default.PropTypes.array,
    inline: _react2.default.PropTypes.bool,
    isClearable: _react2.default.PropTypes.bool,
    locale: _react2.default.PropTypes.string,
    maxDate: _react2.default.PropTypes.object,
    minDate: _react2.default.PropTypes.object,
    monthsShown: _react2.default.PropTypes.number,
    name: _react2.default.PropTypes.string,
    onBlur: _react2.default.PropTypes.func,
    onChange: _react2.default.PropTypes.func.isRequired,
    onChangeRaw: _react2.default.PropTypes.func,
    onFocus: _react2.default.PropTypes.func,
    onMonthChange: _react2.default.PropTypes.func,
    openToDate: _react2.default.PropTypes.object,
    peekNextMonth: _react2.default.PropTypes.bool,
    placeholderText: _react2.default.PropTypes.string,
    popoverAttachment: _react2.default.PropTypes.string,
    popoverTargetAttachment: _react2.default.PropTypes.string,
    popoverTargetOffset: _react2.default.PropTypes.string,
    readOnly: _react2.default.PropTypes.bool,
    renderCalendarTo: _react2.default.PropTypes.any,
    required: _react2.default.PropTypes.bool,
    scrollableYearDropdown: _react2.default.PropTypes.bool,
    selected: _react2.default.PropTypes.object,
    selectsEnd: _react2.default.PropTypes.bool,
    selectsStart: _react2.default.PropTypes.bool,
    showMonthDropdown: _react2.default.PropTypes.bool,
    showWeekNumbers: _react2.default.PropTypes.bool,
    showYearDropdown: _react2.default.PropTypes.bool,
    forceShowMonthNavigation: _react2.default.PropTypes.bool,
    startDate: _react2.default.PropTypes.object,
    tabIndex: _react2.default.PropTypes.number,
    tetherConstraints: _react2.default.PropTypes.array,
    title: _react2.default.PropTypes.string,
    todayButton: _react2.default.PropTypes.string,
    utcOffset: _react2.default.PropTypes.number,
    withPortal: _react2.default.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      dateFormatCalendar: 'MMMM YYYY',
      onChange: function onChange() {},

      disabled: false,
      disabledKeyboardNavigation: false,
      dropdownMode: 'scroll',
      onFocus: function onFocus() {},
      onBlur: function onBlur() {},
      onMonthChange: function onMonthChange() {},

      popoverAttachment: 'top left',
      popoverTargetAttachment: 'bottom left',
      popoverTargetOffset: '10px 0',
      tetherConstraints: [{
        to: 'window',
        attachment: 'together'
      }],
      utcOffset: (0, _moment2.default)().utcOffset(),
      monthsShown: 1,
      withPortal: false
    };
  },
  getInitialState: function getInitialState() {
    return {
      open: false,
      preventFocus: false,
      preSelection: this.props.selected ? (0, _moment2.default)(this.props.selected) : (0, _moment2.default)()
    };
  },
  componentWillUnmount: function componentWillUnmount() {
    this.clearPreventFocusTimeout();
  },
  clearPreventFocusTimeout: function clearPreventFocusTimeout() {
    if (this.preventFocusTimeout) {
      clearTimeout(this.preventFocusTimeout);
    }
  },
  setFocus: function setFocus() {
    this.refs.input.focus();
  },
  setOpen: function setOpen(open) {
    this.setState({
      open: open,
      preSelection: open && this.state.open ? this.state.preSelection : this.getInitialState().preSelection
    });
  },
  handleFocus: function handleFocus(event) {
    if (!this.state.preventFocus) {
      this.props.onFocus(event);
      this.setOpen(true);
    }
  },
  cancelFocusInput: function cancelFocusInput() {
    clearTimeout(this.inputFocusTimeout);
    this.inputFocusTimeout = null;
  },
  deferFocusInput: function deferFocusInput() {
    var _this = this;

    this.cancelFocusInput();
    this.inputFocusTimeout = (0, _defer2.default)(function () {
      return _this.setFocus();
    });
  },
  handleDropdownFocus: function handleDropdownFocus() {
    this.cancelFocusInput();
  },
  handleBlur: function handleBlur(event) {
    if (this.state.open) {
      this.deferFocusInput();
    } else {
      this.props.onBlur(event);
    }
  },
  handleCalendarClickOutside: function handleCalendarClickOutside(event) {
    this.setOpen(false);
    if (this.props.withPortal) {
      event.preventDefault();
    }
  },
  handleSelect: function handleSelect(date, event) {
    var _this2 = this;

    // Preventing onFocus event to fix issue
    // https://github.com/Hacker0x01/react-datepicker/issues/628
    this.setState({ preventFocus: true }, function () {
      _this2.preventFocusTimeout = setTimeout(function () {
        return _this2.setState({ preventFocus: false });
      }, 50);
      return _this2.preventFocusTimeout;
    });
    this.setSelected(date, event);
    this.setOpen(false);
  },
  setSelected: function setSelected(date, event) {
    var changedDate = date;

    if (changedDate !== null && (0, _date_utils.isDayDisabled)(changedDate, this.props)) {
      return;
    }

    if (!(0, _date_utils.isSameDay)(this.props.selected, changedDate)) {
      if (changedDate !== null) {
        if (this.props.selected) {
          changedDate = (0, _moment2.default)(changedDate).set({
            hour: this.props.selected.hour(),
            minute: this.props.selected.minute(),
            second: this.props.selected.second()
          });
        }
        this.setState({
          preSelection: changedDate
        });
      }

      this.props.onChange(changedDate, event);
    }
  },
  setPreSelection: function setPreSelection(date) {
    var isDateRangePresent = typeof this.props.minDate !== 'undefined' && typeof this.props.maxDate !== 'undefined';
    var isValidDateSelection = isDateRangePresent ? (0, _date_utils.isDayInRange)(date, this.props.minDate, this.props.maxDate) : true;
    if (isValidDateSelection) {
      this.setState({
        preSelection: date
      });
    }
  },
  onInputClick: function onInputClick() {
    if (!this.props.disabled) {
      this.setOpen(true);
    }
  },
  onInputKeyDown: function onInputKeyDown(event) {
    if (!this.state.open && !this.props.inline) {
      if (/^Arrow/.test(event.key)) {
        this.onInputClick();
      }
      return;
    }
    var copy = (0, _moment2.default)(this.state.preSelection);
    if (event.key === 'Enter') {
      event.preventDefault();
      this.handleSelect(copy, event);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.setOpen(false);
    } else if (event.key === 'Tab') {
      this.setOpen(false);
    }
    if (!this.props.disabledKeyboardNavigation) {
      var newSelection = void 0;
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          newSelection = copy.subtract(1, 'days');
          break;
        case 'ArrowRight':
          event.preventDefault();
          newSelection = copy.add(1, 'days');
          break;
        case 'ArrowUp':
          event.preventDefault();
          newSelection = copy.subtract(1, 'weeks');
          break;
        case 'ArrowDown':
          event.preventDefault();
          newSelection = copy.add(1, 'weeks');
          break;
        case 'PageUp':
          event.preventDefault();
          newSelection = copy.subtract(1, 'months');
          break;
        case 'PageDown':
          event.preventDefault();
          newSelection = copy.add(1, 'months');
          break;
        case 'Home':
          event.preventDefault();
          newSelection = copy.subtract(1, 'years');
          break;
        case 'End':
          event.preventDefault();
          newSelection = copy.add(1, 'years');
          break;
      }
      this.setPreSelection(newSelection);
    }
  },
  onClearClick: function onClearClick(event) {
    event.preventDefault();
    this.props.onChange(null, event);
  },
  renderCalendar: function renderCalendar() {
    if (!this.props.inline && (!this.state.open || this.props.disabled)) {
      return null;
    }
    return _react2.default.createElement(
      WrappedCalendar,
      {
        ref: 'calendar',
        locale: this.props.locale,
        dateFormat: this.props.dateFormatCalendar,
        dropdownMode: this.props.dropdownMode,
        selected: this.props.selected,
        preSelection: this.state.preSelection,
        onSelect: this.handleSelect,
        openToDate: this.props.openToDate,
        minDate: this.props.minDate,
        maxDate: this.props.maxDate,
        selectsStart: this.props.selectsStart,
        selectsEnd: this.props.selectsEnd,
        startDate: this.props.startDate,
        endDate: this.props.endDate,
        excludeDates: this.props.excludeDates,
        filterDate: this.props.filterDate,
        onClickOutside: this.handleCalendarClickOutside,
        highlightDates: this.props.highlightDates,
        includeDates: this.props.includeDates,
        peekNextMonth: this.props.peekNextMonth,
        showMonthDropdown: this.props.showMonthDropdown,
        showWeekNumbers: this.props.showWeekNumbers,
        showYearDropdown: this.props.showYearDropdown,
        forceShowMonthNavigation: this.props.forceShowMonthNavigation,
        scrollableYearDropdown: this.props.scrollableYearDropdown,
        todayButton: this.props.todayButton,
        utcOffset: this.props.utcOffset,
        outsideClickIgnoreClass: outsideClickIgnoreClass,
        fixedHeight: this.props.fixedHeight,
        monthsShown: this.props.monthsShown,
        onDropdownFocus: this.handleDropdownFocus,
        onMonthChange: this.props.onMonthChange,
        className: this.props.calendarClassName },
      this.props.children
    );
  },
  renderDateInput: function renderDateInput() {
    var className = (0, _classnames3.default)(this.props.className, _defineProperty({}, outsideClickIgnoreClass, this.state.open));
    return _react2.default.createElement(_date_input2.default, {
      ref: 'input',
      id: this.props.id,
      name: this.props.name,
      autoFocus: this.props.autoFocus,
      date: this.props.selected,
      locale: this.props.locale,
      minDate: this.props.minDate,
      maxDate: this.props.maxDate,
      excludeDates: this.props.excludeDates,
      includeDates: this.props.includeDates,
      filterDate: this.props.filterDate,
      dateFormat: this.props.dateFormat,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
      onClick: this.onInputClick,
      onChangeRaw: this.props.onChangeRaw,
      onKeyDown: this.onInputKeyDown,
      onChangeDate: this.setSelected,
      placeholder: this.props.placeholderText,
      disabled: this.props.disabled,
      autoComplete: this.props.autoComplete,
      className: className,
      title: this.props.title,
      readOnly: this.props.readOnly,
      required: this.props.required,
      tabIndex: this.props.tabIndex,
      customInput: this.props.customInput });
  },
  renderClearButton: function renderClearButton() {
    if (this.props.isClearable && this.props.selected != null) {
      return _react2.default.createElement('a', { className: 'react-datepicker__close-icon', href: '#', onClick: this.onClearClick });
    } else {
      return null;
    }
  },
  render: function render() {
    var calendar = this.renderCalendar();

    if (this.props.inline) {
      return calendar;
    }

    if (this.props.withPortal) {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: 'react-datepicker__input-container' },
          this.renderDateInput(),
          this.renderClearButton()
        ),
        this.state.open ? _react2.default.createElement(
          'div',
          { className: 'react-datepicker__portal' },
          calendar
        ) : null
      );
    }

    return _react2.default.createElement(
      _tether_component2.default,
      {
        classPrefix: 'react-datepicker__tether',
        attachment: this.props.popoverAttachment,
        targetAttachment: this.props.popoverTargetAttachment,
        targetOffset: this.props.popoverTargetOffset,
        renderElementTo: this.props.renderCalendarTo,
        constraints: this.props.tetherConstraints },
      _react2.default.createElement(
        'div',
        { className: 'react-datepicker__input-container' },
        this.renderDateInput(),
        this.renderClearButton()
      ),
      calendar
    );
  }
});

module.exports = DatePicker;
