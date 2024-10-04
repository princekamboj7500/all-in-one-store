import React, { useCallback, useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  Card,
  Text,
  Badge,
  Page,
  Layout,
  Icon,
  Filters,
  Modal,
  Frame,
  Button,
  Thumbnail,
  InlineStack,
  IndexTable,
  TextField,
  useIndexResourceState,
  useBreakpoints,
  EmptySearchResult,
  InlineGrid,
  BlockStack,
  Tooltip,
  Box,
  ButtonGroup,
  Checkbox,
  Toast,
  Spinner,
  IndexFilters,
  IndexFiltersMode,
  ChoiceList,
  useSetIndexFiltersMode,
  Link,
} from "@shopify/polaris";


import {
  DeleteIcon,
  ReplayIcon,
  EditIcon,
  SendIcon,
  StarFilledIcon,
  SearchIcon,
  ViewIcon,
  ImageIcon,
  PlusIcon,
} from "@shopify/polaris-icons";

import { useTranslation } from "react-i18next";

const Moderation = ({data, store})=>{
    let { t } = useTranslation();
    const [buttonloading, setButtonLoading] = useState(false);
    const [reviews, setReviews]= useState(data);
    const [msgData, setMsgData] = useState("");
    const [active, setActive] = useState(false);
    const [error, setError] = useState("");
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [buttonLoader, setButtonLoader] = useState(false);

    const[productId, setProductId]= useState(null)
    const resourceName = {
        singular: "review",
        plural: "reviews",
      };
      const commonOverlay = {
        position: "absolute",
        top: "0",
        bottom: "0",
        display: "flex",
        left: "0",
        right: "0",
        width: "100%",
        height: "100%",
        opacity: "0",
        cursor: "pointer",
        zIndex: "99",
      };
   
    
      const [availability, setAvailability] = useState([]);
      const [productType, setProductType] = useState([]);
      const [taggedWith, setTaggedWith] = useState("");
      const [queryValue, setQueryValue] = useState("");
      const [editReviewId, setEditReviewId] = useState(null);
      const handleAvailabilityChange = useCallback(async (value) => {
        setAvailability(value);
        setButtonLoader(true);
        const payload = {
          action: "Rating",
          type: value,
         
        };
        try {
          const response = await fetch("/api/get-filter?type=moderate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
    
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setReviews(data.data);
          setButtonLoader(false);
        } catch (error) {
          console.error("API call failed:", error);
        }
      }, []);
    
      
    
     
     
      const handleFiltersQueryChange = useCallback(async (value) => {
        setQueryValue(value);
        setButtonLoader(true);
        try {
          const response = await fetch(`/api/getfilter?type=${value}&all=all`);
          const data = await response.json();
          if (data.success) {
            setReviews(data.data);
            setButtonLoader(false);
          } else {
            setReviews([]);
            setButtonLoader(false);
          }
        } catch (error) {
          setButtonLoader(false);
          console.error("Error fetching data:", error);
        }
      }, []);
    
      const handleAvailabilityRemove = useCallback(() => {
        setAvailability([]);
        setFilteredReviews(reviews);
      }, []);
      const handleProductTypeRemove = useCallback(() => {
        setProductType([]);
        setReviews(reviews);
      }, []);
      const handleTaggedWithRemove = useCallback(() => {
        setTaggedWith("");
        setReviews(reviews);
      }, []);
      const handleQueryValueRemove = useCallback(() => {
        setQueryValue("");
        setReviews(reviews);
      }, []);
    
      const handleFiltersClearAll = useCallback(() => {
        handleAvailabilityRemove();
        handleProductTypeRemove();
        handleTaggedWithRemove();
        handleQueryValueRemove();
      }, [
        handleAvailabilityRemove,
        handleQueryValueRemove,
        handleProductTypeRemove,
        handleTaggedWithRemove,
      ]);
      const filters = [
        {
          key: "rating",
          label: "Rating",
          filter: (
            <ChoiceList
              title="Rating"
              titleHidden
              choices={[
                { label: "5 Stars", value: "5" },
                { label: "4 Stars", value: "4" },
                { label: "3 Stars", value: "3" },
                { label: "2 Stars", value: "2" },
                { label: "1 Stars", value: "1" },
              ]}
              selected={availability || []}
              onChange={handleAvailabilityChange}
              allowMultiple
            />
          ),
          shortcut: true,
        },
       
      ];
    
      
      const appliedFilters = [];
      if (!isEmpty(availability)) {
        const key = "rating";
        appliedFilters.push({
          key,
          label: disambiguateLabel(key, availability),
          onRemove: handleAvailabilityRemove,
        });
      }
      if (!isEmpty(productType)) {
        const key = "source";
        appliedFilters.push({
          key,
          label: disambiguateLabel(key, productType),
          onRemove: handleProductTypeRemove,
        });
      }
      if (!isEmpty(taggedWith)) {
        const key = "status";
        appliedFilters.push({
          key,
          label: disambiguateLabel(key, taggedWith),
          onRemove: handleTaggedWithRemove,
        });
      }
    const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(reviews);
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };
      const toggleActive = useCallback(
        () => setActive((prevActive) => !prevActive),
        [],
      );
      function truncateContent(content, wordLimit) {
        const words = content.split(" ");
        if (words.length > wordLimit) {
          return words.slice(0, wordLimit).join(" ") + "...";
        }
        return content;
      }
      const toastMarkup = active ? (
        <Frame>
          <Toast content={msgData} onDismiss={toggleActive} error={error} />
        </Frame>
      ) : null;
      const handleAction = async (action, productId, store) => {
        const selectedProductIds = selectedResources;
        setButtonLoader(true);
    
        const data = {
          action,
          product_id: productId,
          store_name: store,
          ids: selectedProductIds,
        };
    
        const response = await fetch("/api/publish", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        if (result.success) {
          setActive(true);
          setError(false);
          setActiveField(false);
          setButtonLoader(false);
          setFilteredReviews(result.data);
          setMsgData(`Review ${action.toLowerCase()}`);
        } else {
          setButtonLoader(false);
          setActive(true);
          setActiveField(false);
          setError(true);
          setMsgData("There is some error while update");
        }
      };
      const promotedBulkActions = [
        {
          content: "Publish",
          loading: buttonloading,
          onAction: () => handlePublish(productId, store),
        },
      ];
      const handlePublish = async (productId, store) => {
        setButtonLoader(true);
        try {
          const data = {
            action: "publish",
            product_id: productId,
            store_name: store,
          };
    
          const response = await fetch("/api/publish", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
    
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
    
          const result = await response.json();
    
          if (result.success) {
            setActive(true);
            setError(false);
            setActiveField(false);
            setButtonLoader(false);
            setMsgData("Reviews Published Successfully");
            setReviews(result.data);
          } else {
            setButtonLoader(false);
            setActive(true);
            setActiveField(false);
            setError(true);
            setMsgData("There is some error while update");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setButtonLoader(false);
        }
      };
      const [activeField, setActiveField] = useState(null);
      const [reply, setReply] = useState("");
      const handleReplyModal = useCallback((review, id,product_id) => {
    
        setReply(review.storeReply);
        setShowReplyModal(true);
        setProductId(product_id)
        setEditReviewId(id);
      }, []);
      const handleSaveReply = async () => {
        setButtonLoader(true);
        setShowReplyModal(true);
    
        try {
          const data = {
            action: "SaveReply",
            product_id: productId,
            store_name: store,
            id: editReviewId,
            reply_content: reply,
          };
          const response = await fetch("/api/updateReview", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
    
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
    
          const result = await response.json();
    
          if (result.data) {
            setActive(true);
            setShowReplyModal(false);
            setActiveField(false);
            setError(false);
            setReviews(result.data);
            setButtonLoader(false);
            setMsgData("Reply Saved");
          } else {
            setButtonLoading(false);
            setActive(true);
            setActiveField(false);
            setError(true);
            setMsgData("There is some error while update");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
        }
      };
      const handleChange = (value, property) => {
        setEditReview((editReview) => ({
          ...editReview,
          [property]: value,
        }));
      };
      const [modalphotos, setModalPhotos] = useState([]);
  const [showPhotosModal, setShowPhotoModal] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const handlePhotModal = useCallback((review, id,product_id) => {
    setModalPhotos(review.image);
    setProductId(product_id)
    setUploadedImages(review.image);
    setEditReviewId(id);
    setNewFiles([]);
    setShowPhotoModal(true);
  }, []);
  const handleImageUpload = (id, event, product_id) => {
    const files = Array.from(event.target.files);
    const fileArray = files.map((file) => URL.createObjectURL(file));
    const newImages = [...files];

    setNewFiles((prevData) => [...prevData, ...files]);
    setUploadedImages((prevImages) => [...prevImages, ...fileArray]);
  };
      const handleSaveImageModal = async () => {
        setButtonLoader(true);
        const formData = new FormData();
    
        uploadedImages
          .filter((image) => !image.includes("blob"))
          .forEach((image, index) => {
            formData.append(`exist`, image);
          });
    
        newFiles.forEach((file, index) => {
          formData.append(`files`, file);
        });
    
        formData.append("product_id", productId);
        formData.append("store_name", store);
        formData.append("id", editReviewId);
        try {
          const response = await fetch(`/api/uploads`, {
            method: "POST",
            body: formData,
          });
    
          const result = await response.json();
         
          if (result.success) {
            setNewFiles([]);
            setButtonLoader(false);
            setError(false);
            setActive(true);
            setFilteredReviews(result.data);
            setShowPhotoModal(false);
            setMsgData("Saved successfully");
          } else {
            setButtonLoading(false);
            setActive(true);
            setButtonLoader(false);
            setNewFiles([]);
            setActiveField(false);
            setError(true);
            setMsgData("There is some error while update");
          }
        } catch (err) {
            setButtonLoader(false);
          setShowPhotoModal(false);
        }
      };
      const photoModal = (
        <div className="modals">
          <Frame>
            <Modal
              open={showPhotosModal}
              onClose={() => setShowPhotoModal(false)}
              title={t('editReview.update')}
              primaryAction={{
                content: t('editReview.save'),
                onAction: handleSaveImageModal,
                loading: buttonLoader,
              }}
              secondaryActions={[
                {
                  content: t('editReview.close'),
                  onAction: () => setShowPhotoModal(false),
                },
              ]}
            >
              <Modal.Section>
                <BlockStack gap="300">
                  <InlineGrid columns={4} gap="400">
                    {uploadedImages.map((photo, index) => (
                      <div
                        className="modal-image-box"
                        style={{
                          width: "100%",
                          borderRadius: "10px",
                          aspectRatio: "1/1",
                          border: "1px solid #ddd",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <img
                          src={photo}
                          key={photo.index}
                          style={{
                            width: "100%",
                            objectFit: "cover",
                            height: "100%",
                          }}
                        />
                        <span
                          style={commonOverlay}
                          className="delete-icon"
                          onClick={() => handleDeleteImage(photo)}
                        >
                          <Icon source={DeleteIcon} tone="inherit" />
                        </span>
                      </div>
                    ))}
                    <div
                      className=""
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                        display: "flex",
                        cursor: "pointer",
                        aspectRatio: "1/1",
                        border: "1px solid #ddd",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <input
                        type="file"
                        hidden
                        className="hidden"
                        accept="image/jpg,image/jpeg,image/png,image/gif,image/webp"
                        style={commonOverlay}
                        onChange={(event) => handleImageUpload(editReviewId, event )}
                      />
                      <Icon source={PlusIcon}></Icon>
                    </div>
                  </InlineGrid>
                  <Text tone="subdued">
                    {t('editReview.error')}
                  </Text>
                </BlockStack>
              </Modal.Section>
            </Modal>
          </Frame>
        </div>
      );
      const bulkActions = [
        {
          content: "Mark unfeatured",
          loading: buttonLoader,
          onAction: () => handleAction("unfeatured", productId, store),
        },
        {
          loading: buttonLoader,
          content: "Mark featured",
          onAction: () => handleAction("featured", productId, store),
        },
        {
          loading: buttonLoader,
          content: "Verified",
          onAction: () => handleAction("Verified", productId, store),
        },
        {
          loading: buttonLoader,
          content: "Not Verified",
          onAction: () => handleAction("Not Verified", productId, store),
        },
        {
          loading: buttonLoader,
          content: "Unpublished",
          onAction: () => handleAction("Unpublished", productId, store),
        },
        {
          loading: buttonLoader,
          icon: DeleteIcon,
          destructive: true,
          content: "Delete ",
          onAction: () => handleAction("Delete", productId, store),
        },
      ];
      const replyModal = (
        <div className="modals">
          <Frame>
            <Modal
              open={showReplyModal}
              onClose={() => setShowReplyModal(false)}
              title={t('editReview.reply')}
              primaryAction={{
                content: t('editReview.replybtn'),
                loading: buttonLoader,
                onAction: () => handleSaveReply(),
              }}
              secondaryActions={[
                {
                  content: t('editReview.close'),
                  onAction: () => setShowReplyModal(false),
                },
              ]}
            >
              <Modal.Section>
                <TextField
                  onChange={(e) => {
                    setReply(e);
                  }}
                  value={reply}
                  multiline={5}
                  autoComplete="off"
                />
              </Modal.Section>
            </Modal>
          </Frame>
        </div>
      );
      const [editReview, setEditReview] = useState({
        rating: "",
        name: "",
        date: "",
        email: "",
        content: "",
      });
    
      const [editConsent, setEditConsent] = useState(true);
      const [showEditModal, setShowEditModal] = useState(false);
      const handleEditModal = useCallback((review, id) => {
        setEditReview({
          rating: review.rating,
          name: review.name,
          date: review.createdAt,
          email: review.email,
          content: review.reviewDesc,
        });
    
        setEditReviewId(id);
        setShowEditModal(true);
      }, []);

  let handleClose = () => {
    setShowEditModal(false);
  };
  const editModal = (
    <div className="modals">
      <Frame>
        <Modal
          open={showEditModal}
          onClose={handleClose}
          title={t('editReview.heading')}
         
          secondaryActions={[
            {
              content: t('editReview.close'),
              onAction: handleClose,
            },
          ]}
        >
          <Modal.Section>
            <BlockStack gap={300}>
              <TextField
                value={editReview.rating}
                label={t('editReview.rating')}
                readOnly
               
              />
              <TextField
                onChange={(e) => {
                  handleChange(e, "name");
                }}
                readOnly
                value={editReview.name}
                label={t('editReview.name')}
              />
              <InlineGrid
                columns={{
                  sm: "100%",
                  md: "2",
                }}
                gap={200}
              >
                <TextField
                  onChange={(e) => {
                    handleChange(e, "date");
                  }}
                  readOnly
                  value={formatDate(editReview.date)}
                  label={t('editReview.Date')}
                  type="date"
                />
                <TextField
                  value={editReview.email}
                  type="email"
                  onChange={(e) => {
                    handleChange(e, "email");
                  }}
                  readOnly
                  label={t('editReview.email')}
                />
              </InlineGrid>
              <TextField
                value={editReview.content}
                label={t('editReview.content')}
                onChange={(e) => {
                  handleChange(e, "content");
                }}
                readOnly
                multiline={2}
              />
             
            </BlockStack>
          </Modal.Section>
        </Modal>
      </Frame>
    </div>
  );

    const rowMarkup =
    reviews.length > 0 ? (
        reviews.map(
        (
          {
            id,
            name,
            featured,
            reviewDesc,
            storeReply,
            product_title,
            email,
            source,
            rating,
            createdAt,
            status,
            product_handle,
            product_id,
            image,
            verified,
          },
          index,
        ) => {
          const dateObj = new Date(createdAt);
          const day = dateObj.getUTCDate();
          const month = dateObj.getUTCMonth() + 1;
          const year = dateObj.getUTCFullYear();
          const formattedDate = `${month}/${day}/${year}`;
          const url = `https://${store}/${product_handle}`;

          return (
            <IndexTable.Row
              id={id}
              key={id}
              selected={selectedResources.includes(id)}
              position={index}
            >
              <IndexTable.Cell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {verified === true && (
                    <svg
                      viewBox="0 0 20 20"
                      className="Polaris-Icon__Svg"
                      focusable="false"
                      aria-hidden="true"
                      style={{
                        width: "20px",
                        height: "20px",
                        verticalAlign: "middle",
                        marginRight: "8px",
                      }} // Adjust size and alignment
                    >
                      <path
                        fill="#29845a"
                        d="M13.28 9.03a.75.75 0 0 0-1.06-1.06l-2.97 2.97-1.22-1.22a.75.75 0 0 0-1.06 1.06l1.75 1.75a.75.75 0 0 0 1.06 0l3.5-3.5Z"
                      ></path>
                      <path
                        fillRule="evenodd"
                        fill="#29845a"
                        d="M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-1.5 0a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z"
                      ></path>
                    </svg>
                  )}
                  <span>{name}</span>
                </div>
              </IndexTable.Cell>
              <IndexTable.Cell>
                <InlineStack gap={0} blockAlign="center">
                  {Array.from({ length: rating }).map((_, starIndex) => (
                    <span
                      className="star-icon"
                      style={{ color: "#ffb800" }}
                      key={starIndex}
                    >
                      <Icon
                        gap={0}
                        key={starIndex}
                        source={StarFilledIcon}
                        tone="inherit"
                      />
                    </span>
                  ))}
                </InlineStack>
              </IndexTable.Cell>
              <IndexTable.Cell>
                <BlockStack gap={200} inlineAlign="start">
                  <Text>{truncateContent(reviewDesc, 7)}</Text>
                  <InlineStack gap={200}>
                    {featured && <Badge tone="info">{t('editReview.Featured')}</Badge>}
                    {storeReply && <Badge tone="info">{t('editReview.Replied')}</Badge>}
                  </InlineStack>
                </BlockStack>
              </IndexTable.Cell>
              <IndexTable.Cell>{source}</IndexTable.Cell>
              <IndexTable.Cell>
                <span
                  onClick={() => handlePhotModal(reviews[index], id,product_id)}
                  style={{ display: "inline-block" }}
                >
                  <Thumbnail
                    source={image.length > 0 ? image[0] : ImageIcon}
                    size="small"
                    alt=""
                  />
                </span>
              </IndexTable.Cell>
              <IndexTable.Cell>
              <Link  dataPrimaryLink target="_blank" url={url} >{product_title}</Link>
              
              </IndexTable.Cell>
              <IndexTable.Cell>
                {status == "Published" ? (
                  <Badge tone="success">{t('editReview.Published')}</Badge>
                ) : (
                  <Badge tone="attention">{t('editReview.moderations')}</Badge>
                )}
              </IndexTable.Cell>

              <IndexTable.Cell>{formattedDate}</IndexTable.Cell>
              <IndexTable.Cell>
                <ButtonGroup>
                <Tooltip content={t('editReview.details')}>
                    <Button
                      icon={ViewIcon}
                      accessibilityLabel={t('editReview.details')}
                      onClick={() =>
                        handleEditModal(reviews[index], id)
                      }
                      variant="tertiary"
                    />
                  </Tooltip>
                  <Tooltip content={t('editReview.write')}>
                    <Button
                      icon={ReplayIcon}
                      accessibilityLabel={t('editReview.write')}
                      onClick={() =>
                        handleReplyModal(reviews[index], id,product_id )
                      }
                      variant="tertiary"
                    />
                  </Tooltip>
                  
                </ButtonGroup>
              
              </IndexTable.Cell>
            </IndexTable.Row>
          );
        },
      )
    ) : (
      <div>{t('editReview.noexits')}</div>
    );
    const emptyStateMarkup = (
        <EmptySearchResult
          title={t('editReview.empty')}
          description={t('editReview.emptyDesc')}
          withIllustration
        />
      );
  
    return<>
     <Layout>
        <Layout.Section>
          <Card padding={0} roundedAbove="sm" style={{ overflow: "hidden" }}>
            <Filters
              queryValue={queryValue}
              queryPlaceholder="Search items"
              filters={filters}
              appliedFilters={appliedFilters}
              onQueryChange={handleFiltersQueryChange}
              onQueryClear={handleQueryValueRemove}
              onClearAll={handleFiltersClearAll}
              loading={buttonLoader}
            />

            <IndexTable
              condensed={useBreakpoints().smDown}
              resourceName={resourceName}
              emptyState={emptyStateMarkup}
              itemCount={reviews.length}
              selectedItemsCount={
                allResourcesSelected ? "All" : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              headings={[
                { title: t('editReview.name')},
                { title: t('editReview.rating') },
                { title: t('editReview.review') },
                { title:  t('editReview.source')},
                { title:t('editReview.photos') },
                { title:"Product"},
                { title:t('editReview.status') },
                { title: t('editReview.date') },
                { title: t('editReview.actions') },
              ]}
              bulkActions={bulkActions}
              promotedBulkActions={promotedBulkActions}
            >
              {rowMarkup}
            </IndexTable>
          </Card>
        </Layout.Section>
      </Layout>
      {photoModal}
      {replyModal}
      {editModal}
      {toastMarkup}
    </>
      function disambiguateLabel(key, value) {
        switch (key) {
          case "rating":
            return `Rating is  ${value}`;
          case "source":
            return `Source is is  ${value}`;
          // return value.map((val) => `Source is   ${val}`).join(", ");
          case "status":
            return `Status is  ${value}`;
          default:
            return value.toString();
        }
      }
    
      function isEmpty(value) {
        if (Array.isArray(value)) {
          return value.length === 0;
        } else {
          return value === "" || value == null;
        }
      }
}

export default Moderation;