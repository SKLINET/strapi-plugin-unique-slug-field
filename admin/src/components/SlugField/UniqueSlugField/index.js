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
  disabled,
  onChange,
  required,
  value,
  contentTypeUID,
  ...rest
}) => {
  const [slugValue, setSlugValue] = useState(value);
  const [vuid, setVuid] = useState(null);
  const [sameVuid, setSameVuid] = useState(true);
  const [isValid, setIsValid] = useState(null);
  const { formatMessage } = useIntl();

  // Get content type ID from path
  const id = location.pathname.replace(
    `/admin/content-manager/collectionType/${contentTypeUID}/`,
    ""
  );

  // Fetch field value on page load
  useEffect(() => {
    if (value) {
      setSlugValue(value);
      axiosInstance
        .get(`/unique-slug-field/vuid/${contentTypeUID}/${id}`)
        .then(({ data }) => {
          setVuid(data);
        });
    }

    if (!value) {
      axiosInstance
        .get(`/unique-slug-field/uid/${contentTypeUID}/${id}`)
        .then(({ data }) => {
          if (data.value) {
            setSlugValue(slugify(data.value));
          } else setSlugValue("");
        });
    }
  }, []);

  // Watch for changes in slugValue, and update value based on slugValues value
  useEffect(() => {
    axiosInstance
      .get(`/unique-slug-field/vuid/${contentTypeUID}/${id}`)
      .then(({ data }) => {
        setVuid(data);
      });
    onChange({
      target: {
        name,
        value: slugValue,
        type: attribute.type,
      },
    });
  }, [slugValue]);

  // // Watch for availability of the value
  // useEffect(() => {
  //   if (!isValid) {
  //     onChange({
  //       target: {
  //         name,
  //         value: "",
  //         type: attribute.type,
  //       },
  //     });
  //   }
  // }, [isValid]);

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
                onChange={(e) => {
                  setSlugValue(slugify(e.target.value));
                  if (e.target.value) {
                    axiosInstance
                      .get(
                        `/unique-slug-field/available/${contentTypeUID}/${
                          e.target.value
                        }/${id}${vuid ? `/${vuid}` : ""}`
                      )
                      .then(({ data }) => {
                        setIsValid(
                          data.vuid === vuid ? true : data?.available || false
                        );
                        setSameVuid(data?.vuid === vuid);
                      });
                  }
                }}
              />
            </Stack>
          </Field>
          <IconButton
            onClick={() => {
              axiosInstance
                .get(
                  `/unique-slug-field/uid/${contentTypeUID}/${id}/${slugValue}`
                )
                .then(({ data }) => {
                  if (data?.value) {
                    axiosInstance
                      .get(
                        `/unique-slug-field/available/${contentTypeUID}/${data.value}/${id}`
                      )
                      .then((available) => {
                        if (available?.data?.available) {
                          setSlugValue(data.value);
                          setSameVuid(available?.data?.vuid === vuid);
                        } else {
                          setSlugValue(slugify(data.value + "-1"));
                          setSameVuid(data.viud === vuid);
                        }
                      });
                  }
                });
            }}
            icon={<Refresh />}
            noBorder={true}
          />
          <FieldHint />
          <FieldError />
        </Flex>
        {!isValid && !sameVuid && (
          <Typography variant="pi" fontWeight="bold" textColor="danger600">
            {formatMessage({
              id: getTrad("unique-slug.invalid"),
              defaultMessage: "This value is already used",
            })}
          </Typography>
        )}
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
