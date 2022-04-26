using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq.Dynamic.Core;

namespace Utility
{
    public static class extendValidationAttribute
    {
        public static bool TryValidate<T>(this T formData, ref List<ValidationResult> validationResults)
        {
            var context = new ValidationContext(formData, serviceProvider: null, items: null);
            bool isValid = Validator.TryValidateObject(formData, context, validationResults, true);

            return isValid;
        }

        public static bool TryValidate<T>(this T formData, ref List<ValidationResult> validationResults, params string[] propertyNames)
        {
            bool isValid = true;

            foreach (string propertyName in propertyNames)
            {
                var context = new ValidationContext(formData);
                var value = context.propertyValue(propertyName);
                context.MemberName = propertyName;
                isValid = isValid & Validator.TryValidateProperty(value, context, validationResults);
            }

            return isValid;
        }

        public static bool TryValidate<T>(this string memberName, object value, out List<ValidationResult> validationResults) where T : new()
        {
            validationResults = new List<ValidationResult>();

            var context = new ValidationContext(new T()) { MemberName = memberName };
            bool isValid = Validator.TryValidateProperty(value, context, validationResults);

            return isValid;
        }

        public static object propertyValue(this ValidationContext validationContext, string propertyName)
        {
            if (!string.IsNullOrEmpty(propertyName))
            {
                var propertyInfo = validationContext.ObjectType.GetProperty(propertyName);

                if (propertyInfo == null)
                {
                    throw new MemberAccessException($@" { validationContext.MemberName } associated Attributes' propertyName : [ { propertyName } ] not exist !!");
                }

                return propertyInfo.GetValue(validationContext.ObjectInstance, null);
            }

            return null;
        }
    }

    public class RequiredIfAttribute : ConditionalAttribute
    {
        public RequiredIfAttribute(string condition)
            : base(new RequiredAttribute(), condition)
        {
        }
    }

    public class FileAttribute : ValidationAttribute
    {
        private readonly bool _required;
        private readonly string _propertyName;
        private ValidationAttribute _requiredAttribute;
        private FileExtensionsAttribute _fileExtensionsAttribute;

        public string Extensions { get; set; }
        public string IfCondition { get; set; }
        public FileAttribute(bool required, string propertyName)
        {
            _required = required;
            _propertyName = propertyName;
        }

        private void prepareBaseValidationAttribute()
        {
            if (!string.IsNullOrWhiteSpace(this.Extensions))
            {
                _fileExtensionsAttribute = new FileExtensionsAttribute { Extensions = this.Extensions };
            }

            if (_required)
            {
                if (string.IsNullOrEmpty(IfCondition))
                {
                    _requiredAttribute = new RequiredAttribute();
                }
                else
                {
                    _requiredAttribute = new RequiredIfAttribute(IfCondition);
                }
            }
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            prepareBaseValidationAttribute();

            var propertyInfo = validationContext.ObjectType.GetProperty(_propertyName);
            if (propertyInfo == null)
                return new ValidationResult(String.Format("Property {0} does not exist.", _propertyName));

            var fileName = (string)propertyInfo.GetValue(validationContext.ObjectInstance, null);

            if (!string.IsNullOrEmpty(fileName) && _fileExtensionsAttribute != null)
            {
                return _fileExtensionsAttribute.GetValidationResult(fileName, validationContext);

                //if (!_fileExtensionsAttribute.IsValid(fileName))
                // return new ValidationResult(_fileExtensionsAttribute.FormatErrorMessage(validationContext.DisplayName), new[] { validationContext.MemberName });               
            }

            if (_requiredAttribute != null)
            {
                return _requiredAttribute.GetValidationResult(value, validationContext);
                // return new ValidationResult(_requiredAttribute.FormatErrorMessage(validationContext.DisplayName), new[] { validationContext.MemberName });
            }

            return ValidationResult.Success;
        }
    }

    public abstract class ConditionalAttribute : ValidationAttribute
    {
        protected string _ifcondition = null;
        protected readonly string _condition;
        protected readonly ValidationAttribute _innerAttribute;
        public ConditionalAttribute(ValidationAttribute innerAttribute = null, string condition = "")
        {
            _innerAttribute = innerAttribute;
            _condition = condition;
        }

        public string IfCondition
        {
            get => _ifcondition ?? _condition;
            set => _ifcondition = value == "" ? null : value;
        }

        private static Delegate CreateExpression(Type objectType, string expression)
        {
            var lambdaExpression = DynamicExpressionParser.ParseLambda(objectType, typeof(bool), expression);
            var func = lambdaExpression.Compile();
            return func;
        }

        protected bool conditionMet(ValidationContext validationContext)
        {
            var conditionFunction = CreateExpression(validationContext.ObjectType, IfCondition);
            var conditionMet = (bool)conditionFunction.DynamicInvoke(validationContext.ObjectInstance);
            return conditionMet;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (!conditionMet(validationContext)) return null;

            _innerAttribute.ErrorMessage ??= this.ErrorMessage;
            return _innerAttribute.GetValidationResult(value, validationContext);
        }
    }

    public class CustomExpressionAttribute : ValidationAttribute
    {
        protected readonly string _expression;
        public CustomExpressionAttribute(string expression)
        {
            _expression = expression;
        }

        private static Delegate CreateExpression(Type objectType, string expression)
        {
            var lambdaExpression = DynamicExpressionParser.ParseLambda(objectType, typeof(bool), expression);
            var func = lambdaExpression.Compile();
            return func;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var expressionFunction = CreateExpression(validationContext.ObjectType, _expression);
            var expressionMet = (bool)expressionFunction.DynamicInvoke(validationContext.ObjectInstance);

            if (!expressionMet)
            {
                return new ValidationResult(ErrorMessage, new[] { validationContext.MemberName });
            }

            return ValidationResult.Success;
        }
    }
}
