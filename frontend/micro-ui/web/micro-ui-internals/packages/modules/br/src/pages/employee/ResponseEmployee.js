import { ActionBar, Banner, Card, CardText, DownloadImgIcon, Header, LinkButton, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { downloadDocument } from "../../utils";

const ResponseEmployee = (props) => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardText>
        <Header>{props?.location?.state === "success" ? t("Birth Registration Approved Success !!!") : t("Oops Something went Wrong!!!")}</Header>
        <Banner successful={props?.location?.state === "success"}></Banner>
        <LinkButton
          label={
            <div className="views download_views_padding" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <DownloadImgIcon />
              <p>{t(`DOWNLOAD BR PDF`)}</p>
            </div>
          }
          onClick={() => downloadDocument()}
        />
      </CardText>
      <ActionBar>
        <Link to={"/digit-ui/employee"}>
          <SubmitBar label="GO TO HOME" />
        </Link>
      </ActionBar>
    </Card>
  );
};

export default ResponseEmployee;
