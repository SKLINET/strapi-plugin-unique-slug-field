import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Stack } from "@strapi/design-system/Stack";
import {
  Field,
  FieldHint,
  FieldError,
  FieldLabel,
  FieldInput,
} from "@strapi/design-system/Field";
import { useIntl } from "react-intl";
import { getTrad, axiosInstance } from "../../../utils";
import slugify from "@sindresorhus/slugify";
import Refresh from "@strapi/icons/Refresh";
import { IconButton } from "@strapi/design-system/IconButton";
import { Flex } from "@strapi/design-system/Flex";
import { Typography } from "@strapi/design-system/Typography";

const UniqueSlugField = ({
  attribute,
  error,
  intlLabel,
  labelAction,
  name,
  onChange,
  required,
  value,
  contentTypeUID,
}) => {
  const [slugValue, setSlugValue] = useState(value);
  const [vuid, setVuid] = useState(null);
  const [sameVuid, setSameVuid] = useState(true);
  const [isValid, setIsValid] = useState();
  const { formatMessage } = useIntl();

  // Get content type ID from path
  const id = location.pathname.replace(
    `/admin/content-manager/collectionType/${contentTypeUID}/`,
    ""
  );

  // Fetch field value on page load
  useEffect(() => {
    const fetchVuid = async () => {
      const data = await axiosInstance.get(
        `/unique-slug-field/vuid/${contentTypeUID}/${id}`
      );
      if (data) {
        setVuid(data.data.vuid);
      }
    };
    fetchVuid().catch((e) => console.log(e));

    if (!value) {
      const fetchData = async () => {
        const data = await axiosInstance.get(
          `/unique-slug-field/uid/${contentTypeUID}/${id}/${slugValue}`
        );
        setSlugValue(slugify(data.data.value));
        data.data.vuid === vuid ? setSameVuid(true) : setSameVuid(false);
      };
      fetchData().catch((e) => console.log(e));
    }
  }, []);

  // Watch for changes in slugValue, and update value based on slugValues value
  useEffect(() => {
    onChange({
      target: {
        name,
        value: slugValue,
        type: attribute.type,
      },
    });
  }, [slugValue]);

  return (
    <Field name={name} id={name} error={error}>
      <Stack spacing={1}>
        <FieldLabel action={labelAction} required={required}>
          {formatMessage(intlLabel)}
        </FieldLabel>

        <Flex gap={1}>
          <Field name="custom-slug">
            <Stack spacing={1}>
              <FieldInput
                type="text"
                placeholder={formatMessage({
                  id: getTrad("unique-slug.placeholder"),
                  defaultMessage: "your-slug-text",
                })}
                value={slugValue}
                onChange={async (e) => {
                  setSlugValue(slugify(e.target.value));
                  if (e.target.value) {
                    const isAvailable = await axiosInstance.get(
                      `/unique-slug-field/available/${contentTypeUID}/${e.target.value}`
                    );

                    if (isAvailable.data) {
                      setIsValid(isAvailable.data.available);
                      setSameVuid(isAvailable.data.vuid === vuid);
                    }
                  }
                }}
              />
            </Stack>
          </Field>
          <IconButton
            onClick={async () => {
              const data = await axiosInstance.get(
                `/unique-slug-field/uid/${contentTypeUID}/${id}/${slugValue}`
              );
              if (data.data.value) {
                const isAvailable = await axiosInstance.get(
                  `/unique-slug-field/available/${contentTypeUID}/${data.data.value}`
                );
                if (isAvailable.data.available) {
                  setSlugValue(data.data.value);
                  setSameVuid(isAvailable.data.viud === vuid);
                } else {
                  setSlugValue(slugify(data.data.value + "-1"));
                  setSameVuid(data.data.viud === vuid);
                }
              }
            }}
            icon={<Refresh />}
            noBorder={true}
          />
          <FieldHint />
          <FieldError />
        </Flex>
        {/* {slugValue && !isValid && !sameVuid && (
          <Typography variant="pi" fontWeight="bold" textColor="danger600">
            {formatMessage({
              id: getTrad("unique-slug.invalid"),
              defaultMessage: "This value is already used",
            })}
          </Typography>
        )} */}
      </Stack>
    </Field>
  );
};

UniqueSlugField.defaultProps = {
  description: null,
  disabled: false,
  error: null,
  labelAction: null,
  required: false,
  value: "",
};

UniqueSlugField.propTypes = {
  intlLabel: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  attribute: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.object,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  labelAction: PropTypes.object,
  required: PropTypes.bool,
  value: PropTypes.string,
};

export default UniqueSlugField;
