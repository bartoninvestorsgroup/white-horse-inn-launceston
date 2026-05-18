import { useFormValue } from "sanity";

function optionValue(option) {
  return typeof option === "string" ? option : option?.value;
}

const restrictedSectionTypes = {
  Meals: "kidsMenu",
  "Sunday Lunch": "sundayMenu",
  "Non-Roast Mains": "sundayMenu",
};

export default function MenuSectionTitleInput(props) {
  const menuType = useFormValue(["menuType"]);
  const options = props.schemaType.options || {};
  const list = Array.isArray(options.list) ? options.list : [];
  const filteredList = list.filter((option) => {
    const requiredMenuType = restrictedSectionTypes[optionValue(option)];

    return !requiredMenuType || requiredMenuType === menuType;
  });

  return props.renderDefault({
    ...props,
    schemaType: {
      ...props.schemaType,
      options: {
        ...options,
        list: filteredList,
      },
    },
  });
}
