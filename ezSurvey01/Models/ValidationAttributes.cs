using ezSurvey01.Resources;
using Microsoft.Extensions.Localization;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Utility;

namespace ezSurvey01.Models
{
    public static class extendValidationAttribute
    {
        public static string getLocalRawErrorMessage(this ValidationContext validationContext, string ErrorMessage)
        {
            var _localizationService = (IStringLocalizer<ValidationMessages>)validationContext.GetService(typeof(IStringLocalizer<ValidationMessages>));
            var _localErrorMessage = _localizationService[ErrorMessage];
            return _localErrorMessage;
        }

        public static string getLocalErrorMessage(this ValidationContext validationContext, string ErrorMessage, params object[] moreProperties)
        {
            var paramProperties = moreProperties.ToList();
            paramProperties.Insert(0, validationContext.DisplayName);

            var _localErrorMessage = validationContext.getLocalRawErrorMessage(ErrorMessage);
            return string.Format(_localErrorMessage, paramProperties.ToArray());
        }
    }

    public class ValidationzhAttribute : ValidationAttribute
    {
        const string defaultErrorMessage = "Normal";

        protected virtual string DefaultErrorMessage => defaultErrorMessage;

        protected virtual object[] moreProperties => new string[0]; 

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            ErrorMessage ??= DefaultErrorMessage;

            ValidationResult result = ValidationResult.Success;

            // call overridden method.
            if (!this.IsValid(value))
            {
                string[] memberNames = validationContext.MemberName != null ? new string[] { validationContext.MemberName } : null;
                string errorMessage = validationContext.getLocalErrorMessage(ErrorMessage, moreProperties);
                result = new ValidationResult(errorMessage, memberNames);                
            }

            return result;
        }
    }

    public class RequiredzhAttribute : ValidationzhAttribute
    {
        protected override string DefaultErrorMessage => "Required";

        public override bool IsValid(object value)
        {
            return  new RequiredAttribute().IsValid(value);
        }        
    }

    public class RequiredIfzhAttribute : Utility.ConditionalAttribute
    {
        public RequiredIfzhAttribute(string condition)
             : base(new RequiredzhAttribute(), condition)
        {
        }
    }

    public class StringLengthzhAttribute : ValidationzhAttribute
    {
        private readonly int maxLength;

        protected override string DefaultErrorMessage => "StringLength";                
        protected override object[] moreProperties => new object[] { this.maxLength };

        public StringLengthzhAttribute(int maxLength)
        {
            this.maxLength = maxLength;
        }

        public override bool IsValid(object value)
        {
            return new StringLengthAttribute(this.maxLength).IsValid(value);
        }
    }

    public class DateCompareAttribute : ValidationzhAttribute
    {
        private readonly string propertyName;
        private readonly EnumDateCompare dateCompare;
        private readonly CompareType compareType;

        public DateCompareAttribute(string propertyName, EnumDateCompare dateCompare, CompareType compareType = CompareType.Time)
        {
            this.propertyName = propertyName;
            this.dateCompare = dateCompare;
            this.compareType = compareType;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var propertyValue = validationContext.propertyValue(this.propertyName);

            var currentDate = DateTime.Now;
            var propertyDate = DateTime.Now;

            if (commonUtil.IsDateTime(value, ref currentDate)
                && commonUtil.IsDateTime(propertyValue, ref propertyDate)
                && !Compared(currentDate, propertyDate, dateCompare, compareType))
            {
                return new ValidationResult(string.Format(ErrorMessage, value, propertyDate), new[] { this.propertyName, validationContext.MemberName });
            }

            return ValidationResult.Success;
        }

        private bool Compared(DateTime currentDate, DateTime propertyDate, EnumDateCompare dateCompare, CompareType compareType)
        {
            bool result = false;
            bool compareDate = compareType == CompareType.Date;
            DateTime _currentDate = compareDate ? currentDate.Date : currentDate;
            DateTime _propertyDate = compareDate ? propertyDate.Date : propertyDate;

            switch (dateCompare)
            {
                case EnumDateCompare.eq:
                    result = _currentDate == _propertyDate;
                    break;
                case EnumDateCompare.gt:
                    result = _currentDate > _propertyDate;
                    break;
                case EnumDateCompare.lt:
                    result = _currentDate < _propertyDate;
                    break;
                case EnumDateCompare.ge:
                    result = _currentDate >= _propertyDate;
                    break;
                case EnumDateCompare.le:
                    result = _currentDate <= _propertyDate;
                    break;
                case EnumDateCompare.ne:
                    result = _currentDate != _propertyDate;
                    break;

            }

            return result;
        }

        public enum EnumDateCompare
        {
            eq, ne, gt, ge, lt, le
        }

        public enum CompareType
        {
            Date, Time
        }
    }


}
