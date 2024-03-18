import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { format, isValid } from "date-fns";
import { Header, Loader } from "@egovernments/digit-ui-react-components";
import DesktopInbox from "./DesktopInbox";
import { useQuery } from "react-query";
const Inbox = ({ tenants, parentRoute }) => {
  const { t } = useTranslation();
  Digit.SessionStorage.set("ENGAGEMENT_TENANTS", tenants);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [pageSize, setPageSize] = useState(10);
  const [pageOffset, setPageOffset] = useState(0);
  const [searchParams, setSearchParams] = useState({
    eventStatus: [],
    range: {
      startDate: null,
      endDate: new Date(""),
      title: "",
    },
    ulb: tenants?.find((tenant) => tenant?.code === tenantId),
  });
  let isMobile = window.Digit.Utils.browser.isMobile();
  const [data, setData] = useState([]);
  const { isLoading } = data;

  const brData = useQuery(["BR_SEARCH", tenantId, data], () => Digit.BRService.search(tenantId, data));

  console.log(brData?.data?.BirthRegistrationApplications);

  const getSearchFields = () => {
    return [
      {
        label: t("EVENTS_ULB_LABEL"),
        name: "ulb",
        type: "ulb",
      },
      {
        label: t("Baby's First Name"),
        name: "babyFirstName",
      },
      {
        label: t("Baby's Last Name"),
        name: "babyLastName",
      },
    ];
  };

  const links = [
    {
      text: t("Create Birth-Registration"),
      link: "/digit-ui/employee/br/birth",
    },
  ];

  const onSearch = (params) => {
    debugger;
    let updatedParams = { ...params };
    if (!params?.ulb) {
      updatedParams = { ...params, ulb: { code: tenantId } };
    }
    setSearchParams({ ...searchParams, ...updatedParams });
  };

  const handleFilterChange = (data) => {
    setSearchParams({ ...searchParams, ...data });
  };

  const globalSearch = (rows, columnIds) => {
    // return rows;
    return rows?.filter(
      (row) =>
        (searchParams?.babyLastName ? row.original?.babyLastName?.toUpperCase().startsWith(searchParams?.babyLastName?.toUpperCase()) : true) &&
        (searchParams?.babyFirstName ? row.original?.babyFirstName?.toUpperCase().startsWith(searchParams?.babyFirstName?.toUpperCase()) : true)
    );
  };

  const fetchNextPage = useCallback(() => {
    setPageOffset((prevPageOffSet) => parseInt(prevPageOffSet) + parseInt(pageSize));
  }, [pageSize]);

  const fetchPrevPage = useCallback(() => {
    setPageOffset((prevPageOffSet) => parseInt(prevPageOffSet) - parseInt(pageSize));
  }, [pageSize]);

  const handlePageSizeChange = (e) => {
    setPageSize((prevPageSize) => e.target.value);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <Header>{t("Birth-registration")}</Header>
      <p>{}</p>
      <DesktopInbox
        t={t}
        data={
          brData?.data?.BirthRegistrationApplications?.length > 0
            ? brData?.data?.BirthRegistrationApplications
            : [{ id: brData?.data?.BirthRegistrationApplications?.length + 1 || 0, babyFirstName: "Test", babyLastName: "Test" }]
        }
        links={links}
        parentRoute={parentRoute}
        searchParams={searchParams}
        onSearch={onSearch}
        globalSearch={globalSearch}
        searchFields={getSearchFields()}
        onFilterChange={handleFilterChange}
        pageSizeLimit={pageSize}
        totalRecords={data?.totalCount}
        title={"Birth-registration"}
        iconName={"calender"}
        currentPage={parseInt(pageOffset / pageSize)}
        onNextPage={fetchNextPage}
        onPrevPage={fetchPrevPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default Inbox;
