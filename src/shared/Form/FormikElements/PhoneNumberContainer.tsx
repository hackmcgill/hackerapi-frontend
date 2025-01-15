// PhoneNumberContainer.tsx

import styled, { css } from 'styled-components';
import { inputStyles } from '../../Styles/inputStyles';

export const PhoneNumberContainer = styled.div`
  .phone-number-input {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .phone-number-input .PhoneInputInput {
    ${inputStyles}
    border-radius: 8px;
    padding: 0 12px;
    font-size: 16px;
    color: ${(props) => props.theme.colors.black80};

    &::placeholder {
      color: ${(props) => props.theme.colors.black40};
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px ${(props) => props.theme.colors.blueLight};
    }
  }

  .phone-number-input .PhoneInputCountry {
    background-color: ${(props) => props.theme.colors.white};
    border: 1px solid ${(props) => props.theme.colors.greyLight};
    border-radius: 8px;
    padding: 4px 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    height: 35px;
    margin-top: 10px;

    svg {
      width: 16px;
      height: 16px;
      fill: ${(props) => props.theme.colors.black80};
    }

    &:hover {
      background-color: ${(props) => props.theme.colors.greyLight};
    }
  }

  .phone-number-input .PhoneInputCountrySelectDropdown {
    background-color: ${(props) => props.theme.colors.white};
    border: 1px solid ${(props) => props.theme.colors.black};
    border-radius: 4px;
    padding: 8px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
  }

  .phone-number-input .PhoneInputCountrySelectOption {
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    color: ${(props) => props.theme.colors.black80};
    font-family: ${(props) => props.theme.fonts.header};

    &:hover {
      background-color: ${(props) => props.theme.colors.greyLight};
      color: ${(props) => props.theme.colors.black};
    }

    &.PhoneInputCountrySelectOption--selected {
      background-color: ${(props) => props.theme.colors.blueLight};
      color: ${(props) => props.theme.colors.white};
    }
  }
`;

export default PhoneNumberContainer;