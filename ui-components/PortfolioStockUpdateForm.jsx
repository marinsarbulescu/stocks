/* eslint-disable */
"use client";
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SelectField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getPortfolioStock } from "./graphql/queries";
import { updatePortfolioStock } from "./graphql/mutations";
const client = generateClient();
export default function PortfolioStockUpdateForm(props) {
  const {
    id: idProp,
    portfolioStock: portfolioStockModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    symbol: "",
    type: "",
    region: "",
    name: "",
    pdp: "",
    plr: "",
    budget: "",
  };
  const [symbol, setSymbol] = React.useState(initialValues.symbol);
  const [type, setType] = React.useState(initialValues.type);
  const [region, setRegion] = React.useState(initialValues.region);
  const [name, setName] = React.useState(initialValues.name);
  const [pdp, setPdp] = React.useState(initialValues.pdp);
  const [plr, setPlr] = React.useState(initialValues.plr);
  const [budget, setBudget] = React.useState(initialValues.budget);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = portfolioStockRecord
      ? { ...initialValues, ...portfolioStockRecord }
      : initialValues;
    setSymbol(cleanValues.symbol);
    setType(cleanValues.type);
    setRegion(cleanValues.region);
    setName(cleanValues.name);
    setPdp(cleanValues.pdp);
    setPlr(cleanValues.plr);
    setBudget(cleanValues.budget);
    setErrors({});
  };
  const [portfolioStockRecord, setPortfolioStockRecord] = React.useState(
    portfolioStockModelProp
  );
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getPortfolioStock.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getPortfolioStock
        : portfolioStockModelProp;
      setPortfolioStockRecord(record);
    };
    queryData();
  }, [idProp, portfolioStockModelProp]);
  React.useEffect(resetStateValues, [portfolioStockRecord]);
  const validations = {
    symbol: [{ type: "Required" }],
    type: [{ type: "Required" }],
    region: [{ type: "Required" }],
    name: [],
    pdp: [],
    plr: [],
    budget: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          symbol,
          type,
          region,
          name: name ?? null,
          pdp: pdp ?? null,
          plr: plr ?? null,
          budget: budget ?? null,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: updatePortfolioStock.replaceAll("__typename", ""),
            variables: {
              input: {
                id: portfolioStockRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "PortfolioStockUpdateForm")}
      {...rest}
    >
      <TextField
        label="Symbol"
        isRequired={true}
        isReadOnly={false}
        value={symbol}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              symbol: value,
              type,
              region,
              name,
              pdp,
              plr,
              budget,
            };
            const result = onChange(modelFields);
            value = result?.symbol ?? value;
          }
          if (errors.symbol?.hasError) {
            runValidationTasks("symbol", value);
          }
          setSymbol(value);
        }}
        onBlur={() => runValidationTasks("symbol", symbol)}
        errorMessage={errors.symbol?.errorMessage}
        hasError={errors.symbol?.hasError}
        {...getOverrideProps(overrides, "symbol")}
      ></TextField>
      <SelectField
        label="Type"
        placeholder="Please select an option"
        isDisabled={false}
        value={type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              symbol,
              type: value,
              region,
              name,
              pdp,
              plr,
              budget,
            };
            const result = onChange(modelFields);
            value = result?.type ?? value;
          }
          if (errors.type?.hasError) {
            runValidationTasks("type", value);
          }
          setType(value);
        }}
        onBlur={() => runValidationTasks("type", type)}
        errorMessage={errors.type?.errorMessage}
        hasError={errors.type?.hasError}
        {...getOverrideProps(overrides, "type")}
      >
        <option
          children="Stock"
          value="Stock"
          {...getOverrideProps(overrides, "typeoption0")}
        ></option>
        <option
          children="Etf"
          value="ETF"
          {...getOverrideProps(overrides, "typeoption1")}
        ></option>
        <option
          children="Crypto"
          value="Crypto"
          {...getOverrideProps(overrides, "typeoption2")}
        ></option>
      </SelectField>
      <SelectField
        label="Region"
        placeholder="Please select an option"
        isDisabled={false}
        value={region}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              symbol,
              type,
              region: value,
              name,
              pdp,
              plr,
              budget,
            };
            const result = onChange(modelFields);
            value = result?.region ?? value;
          }
          if (errors.region?.hasError) {
            runValidationTasks("region", value);
          }
          setRegion(value);
        }}
        onBlur={() => runValidationTasks("region", region)}
        errorMessage={errors.region?.errorMessage}
        hasError={errors.region?.hasError}
        {...getOverrideProps(overrides, "region")}
      >
        <option
          children="Us"
          value="US"
          {...getOverrideProps(overrides, "regionoption0")}
        ></option>
        <option
          children="Eu"
          value="EU"
          {...getOverrideProps(overrides, "regionoption1")}
        ></option>
        <option
          children="Apac"
          value="APAC"
          {...getOverrideProps(overrides, "regionoption2")}
        ></option>
      </SelectField>
      <TextField
        label="Name"
        isRequired={false}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              symbol,
              type,
              region,
              name: value,
              pdp,
              plr,
              budget,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <TextField
        label="Pdp"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={pdp}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              symbol,
              type,
              region,
              name,
              pdp: value,
              plr,
              budget,
            };
            const result = onChange(modelFields);
            value = result?.pdp ?? value;
          }
          if (errors.pdp?.hasError) {
            runValidationTasks("pdp", value);
          }
          setPdp(value);
        }}
        onBlur={() => runValidationTasks("pdp", pdp)}
        errorMessage={errors.pdp?.errorMessage}
        hasError={errors.pdp?.hasError}
        {...getOverrideProps(overrides, "pdp")}
      ></TextField>
      <TextField
        label="Plr"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={plr}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              symbol,
              type,
              region,
              name,
              pdp,
              plr: value,
              budget,
            };
            const result = onChange(modelFields);
            value = result?.plr ?? value;
          }
          if (errors.plr?.hasError) {
            runValidationTasks("plr", value);
          }
          setPlr(value);
        }}
        onBlur={() => runValidationTasks("plr", plr)}
        errorMessage={errors.plr?.errorMessage}
        hasError={errors.plr?.hasError}
        {...getOverrideProps(overrides, "plr")}
      ></TextField>
      <TextField
        label="Budget"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={budget}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              symbol,
              type,
              region,
              name,
              pdp,
              plr,
              budget: value,
            };
            const result = onChange(modelFields);
            value = result?.budget ?? value;
          }
          if (errors.budget?.hasError) {
            runValidationTasks("budget", value);
          }
          setBudget(value);
        }}
        onBlur={() => runValidationTasks("budget", budget)}
        errorMessage={errors.budget?.errorMessage}
        hasError={errors.budget?.hasError}
        {...getOverrideProps(overrides, "budget")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || portfolioStockModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || portfolioStockModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
