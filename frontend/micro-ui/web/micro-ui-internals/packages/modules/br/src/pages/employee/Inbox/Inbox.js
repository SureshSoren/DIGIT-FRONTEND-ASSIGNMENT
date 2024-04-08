import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { format, isValid } from "date-fns";
import { Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import DesktopInbox from "./DesktopInbox";
import { useQuery } from "react-query";
const Digit = window?.Digit || {};

const config = {
  label: "ES_COMMON_INBOX",
  type: "inbox",
  apiDetails: {
    serviceName: "/inbox/v2/_search",
    requestParam: {},
    requestBody: {
      inbox: {
        processSearchCriteria: {
          businessService: ["PQM"],
          moduleName: "pqm",
          tenantId: "pg.citya",
        },
        moduleSearchCriteria: {
          plantCodes: ["PURI_FSTP"],
          tenantId: "pg.citya",
        },
        tenantId: "pg.citya",
      },
    },
    minParametersForSearchForm: 1,
    tableFormJsonPath: "requestBody.inbox",
    masterName: "commonUiConfig",
    moduleName: "birthRegistrationConfig",
    filterFormJsonPath: "requestBody.inbox.moduleSearchCriteria",
    searchFormJsonPath: "requestBody.inbox.moduleSearchCriteria",
  },
  sections: {
    search: {
      uiConfig: {
        headerStyle: null,
        type: "birth-registration-table-search",
        primaryLabel: "ES_COMMON_SEARCH",
        secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
        minReqFields: 1,
        defaultValues: {
          testIds: "",
        },
        fields: [
          {
            label: "Baby's First Name",
            type: "text",
            isMandatory: false,
            disable: false,
            populators: {
              name: "testIds",
              error: "BR_PATTERN_ERR_MSG",
              validation: {
                pattern: {},
                minlength: 2,
              },
            },
          },
        ],
      },
      label: "",
      children: {},
      show: true,
    },
    links: {
      uiConfig: {
        links: [
          {
            text: "CREATE_BIRTH_REGISTRATION",
            url: "/employee/br/birth",
            roles: [],
          },
        ],
        label: "ES_COMMON_INBOX",
        logoIcon: {
          component: "PropertyHouse",
          customClass: "inbox-search-icon--projects",
        },
      },
      children: {},
      show: true,
    },
    filter: {
      uiConfig: {
        type: "filter",
        headerStyle: null,
        primaryLabel: "ES_COMMON_APPLY",
        minReqFields: 0,
        secondaryLabel: "",
        defaultValues: {
          createdFrom: "",
          createdTo: "",
        },
        fields: [
          {
            label: "STATUS",
            type: "dropdown",
            isMandatory: false,
            disable: false,
            populators: {
              name: "status",
              options: ["b857be69-faf3-4239-9662-642129ab5ce1", "62d3d55a-5bf3-4d38-ac95-5353cd0933f9", "944c70e0-e556-461c-a964-93905b63d5ce"],
            },
          },
        ],
      },
      label: "ES_COMMON_FILTERS",
      show: true,
    },
    searchResult: {
      label: "",
      uiConfig: {
        columns: [
          {
            label: "Baby's First Name",
            jsonPath: "ProcessInstance.businessId",
            additionalCustomization: true,
          },
          {
            label: "Baby's Last Name",
            jsonPath: "ProcessInstance.id",
          },
          {
            label: "Place Of Birth",
            jsonPath: "ProcessInstance.businessService",
          },
          {
            label: "Hospital Name",
            jsonPath: "ProcessInstance.businesssServiceSla",
          },
        ],
        enableGlobalSearch: false,
        enableColumnSort: true,
        resultsJsonPath: "items",
      },
      children: {},
      show: true,
    },
  },
  additionalSections: {},
};
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
    <React.Fragment>
      {/* <div>
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
      </div> */}
      <div>
        <Header>{t("Birth-registration")}</Header>
        <p>{}</p>
        <div className="inbox-search-wrapper">
          <InboxSearchComposer configs={config}></InboxSearchComposer>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Inbox;
