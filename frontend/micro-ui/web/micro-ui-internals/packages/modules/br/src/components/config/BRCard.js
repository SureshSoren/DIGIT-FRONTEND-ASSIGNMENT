import { PersonIcon, EmployeeModuleCard } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const BRCard = () => {
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: <PersonIcon />,
    moduleName: t("Birth Registration"),
    kpis: [
      {
        label: t("Application"),
        link: `/digit-ui/employee/br/Inbox`,
      },
    ],
    links: [
      {
        label: t("Inbox"),
        link: `/digit-ui/employee/br/Inbox`,
      },
      {
        label: t("Registration"),
        link: `/digit-ui/employee/br/birth`,
      },
    ],
    styles: {
      employeeCard: {
        width: "300px",
        height: 250,
        backgroundColor: "white",
      },
      employeeTotalLink: {
        textDecoration: "none",
      },
      employeeLink: {
        textDecoration: "none",
      },
    },
    className: "employee-card",
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default BRCard;
