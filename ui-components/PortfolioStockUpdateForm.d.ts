import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { PortfolioStock } from "./graphql/types";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type PortfolioStockUpdateFormInputValues = {
    symbol?: string;
    type?: string;
    region?: string;
    name?: string;
    pdp?: number;
    plr?: number;
    budget?: number;
};
export declare type PortfolioStockUpdateFormValidationValues = {
    symbol?: ValidationFunction<string>;
    type?: ValidationFunction<string>;
    region?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    pdp?: ValidationFunction<number>;
    plr?: ValidationFunction<number>;
    budget?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PortfolioStockUpdateFormOverridesProps = {
    PortfolioStockUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    symbol?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<SelectFieldProps>;
    region?: PrimitiveOverrideProps<SelectFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    pdp?: PrimitiveOverrideProps<TextFieldProps>;
    plr?: PrimitiveOverrideProps<TextFieldProps>;
    budget?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type PortfolioStockUpdateFormProps = React.PropsWithChildren<{
    overrides?: PortfolioStockUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    portfolioStock?: PortfolioStock;
    onSubmit?: (fields: PortfolioStockUpdateFormInputValues) => PortfolioStockUpdateFormInputValues;
    onSuccess?: (fields: PortfolioStockUpdateFormInputValues) => void;
    onError?: (fields: PortfolioStockUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: PortfolioStockUpdateFormInputValues) => PortfolioStockUpdateFormInputValues;
    onValidate?: PortfolioStockUpdateFormValidationValues;
} & React.CSSProperties>;
export default function PortfolioStockUpdateForm(props: PortfolioStockUpdateFormProps): React.ReactElement;
