import styled from "./styled-components";

interface ILabelProps {
  width?: string;
  fontWeight?: string;
}

export const Label = styled.label<ILabelProps>`
  & > span {
    margin-left: 10px;
    display: inline-block;
  }
  font-weight: ${props => props.fontWeight || "bold"};
  color: ${props => props.theme.colors.greyDark};
  display: block;
  width: ${props => props.width || "100%"};
`;

export default Label;