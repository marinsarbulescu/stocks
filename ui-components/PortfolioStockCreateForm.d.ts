import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type PortfolioStockCreateFormInputValues = {
    symbol?: string;
    type?: string;
    region?: string;
    name?: string;
    pdp?: number;
    plr?: number;
    budget?: number;
};
export declare type PortfolioStockCreateFormValidationValues = {
    symbol?: ValidationFunction<string>;
    type?: ValidationFunction<string>;
    region?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    pdp?: ValidationFunction<number>;
    plr?: ValidationFunction<number>;
    budget?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PortfolioStockCreateFormOverridesProps = {
    PortfolioStockCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    symbol?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<SelectFieldProps>;
    region?: PrimitiveOverrideProps<SelectFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    pdp?: PrimitiveOverrideProps<TextFieldProps>;
    plr?: PrimitiveOverrideProps<TextFieldProps>;
    budget?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type PortfolioStockCreateFormProps = React.PropsWithChildren<{
    overrides?: PortfolioStockCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: PortfolioStockCreateFormInputValues) => PortfolioStockCreateFormInputValues;
    onSuccess?: (fields: PortfolioStockCreateFormInputValues) => void;
    onError?: (fields: PortfolioStockCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: PortfolioStockCreateFormInputValues) => PortfolioStockCreateFormInputValues;
    onValidate?: PortfolioStockCreateFormValidationValues;
} & React.CSSProperties>;
export default function PortfolioStockCreateForm(props: PortfolioStockCreateFormProps): React.ReactElement;
