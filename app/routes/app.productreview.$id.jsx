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
} from "@shopify/polaris";
import db from "../db.server";
import { authenticate } from "../shopify.server";
import "./assets/style.css";
import {
  DeleteIcon,
  ReplayIcon,
  EditIcon,
  SendIcon,
  StarFilledIcon,
  SearchIcon,
  ImageIcon,
  PlusIcon,
} from "@shopify/polaris-icons";
import Table from "./components/Table";
export const loader = async ({ request, params }) => {
  const productId = params.id;
  const { session, admin } = await authenticate.admin(request);
  
  const storeName = session.shop.split(".")[0];
  const getReviews = await db.Reviews.findMany({
    where: {
      product_id: productId,
    },
  });

  return { getReviews, productId, storeName };
};

const ProductReview = () => {
  const navigate = useNavigate();
  const { getReviews, productId, storeName } = useLoaderData();
  const [buttonloading, setButtonLoading] = useState(false);
  const [msgData, setMsgData] = useState("");
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
  const [activeField, setActiveField] = useState(null);

  let store = storeName + ".myshopify.com";
  const [filteredReviews, setFilteredReviews] = useState(getReviews);
  const [buttonLoader, setButtonLoader] = useState(false);

  const toggleActive = useCallback(
    () => setActive((prevActive) => !prevActive),
    [],
  );
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [itemStrings, setItemStrings] = useState([
    "All",
    "Unpaid",
    "Open",
    "Closed",
    "Local delivery",
    "Local pickup",
  ]);
  useEffect(()=>{
   shopify.loading(false)
  },[])

  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions:
      index === 0
        ? []
        : [
            {
              type: "rename",
              onAction: () => {},
              onPrimaryAction: async (value) => {
                const newItemsStrings = tabs.map((item, idx) => {
                  if (idx === index) {
                    return value;
                  }
                  return item.content;
                });
                await sleep(1);
                setItemStrings(newItemsStrings);
                return true;
              },
            },
            {
              type: "duplicate",
              onPrimaryAction: async (value) => {
                await sleep(1);
                duplicateView(value);
                return true;
              },
            },
            {
              type: "edit",
            },
            {
              type: "delete",
              onPrimaryAction: async () => {
                await sleep(1);
                deleteView(index);
                return true;
              },
            },
          ],
  }));

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
      id: productId,
    };
    try {
      const response = await fetch("/api/get-filter", {
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
      setFilteredReviews(data.data);
      setButtonLoader(false);
    } catch (error) {
      console.error("API call failed:", error);
    }
  }, []);

  const handleProductTypeChange = useCallback(async (value) => {
    setProductType(value);
    setButtonLoader(true);
    const payload = {
      action: "Source",
      type: value,
      id: productId,
    };
    try {
      const response = await fetch("/api/get-filter", {
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
      setButtonLoader(false);
      setFilteredReviews(data.data);
    } catch (error) {
      console.error("API call failed:", error);
    }
  }, []);

  const handleTaggedWithChange = useCallback(async (value) => {
    setTaggedWith(value);
    setButtonLoader(true);
    const payload = {
      action: "Status",
      type: value,
      id: productId,
    };
    try {
      const response = await fetch("/api/get-filter", {
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
      setButtonLoader(false);
      setFilteredReviews(data.data);
    } catch (error) {
      console.error("API call failed:", error);
    }
  }, []);
 
  const handleFiltersQueryChange = useCallback(async (value) => {
    setQueryValue(value);
    setButtonLoader(true);
    try {
      const response = await fetch(`/api/getfilter?type=${value}&id=${productId}`);
      const data = await response.json();
      if (data.success) {
        setFilteredReviews(data.data);
        setButtonLoader(false);
      } else {
        setFilteredReviews([]);
        setButtonLoader(false);
      }
    } catch (error) {
      setButtonLoader(false);
      console.error("Error fetching data:", error);
    }
  }, []);

  const handleAvailabilityRemove = useCallback(() => {
    setAvailability([]);
    setFilteredReviews(getReviews);
  }, []);
  const handleProductTypeRemove = useCallback(() => {
    setProductType([]);
    setFilteredReviews(getReviews);
  }, []);
  const handleTaggedWithRemove = useCallback(() => {
    setTaggedWith("");
    setFilteredReviews(getReviews);
  }, []);
  const handleQueryValueRemove = useCallback(() => {
    setQueryValue("");
    setFilteredReviews(getReviews);
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
    {
      key: "source",
      label: "Source",
      filter: (
        <ChoiceList
          title="Source"
          titleHidden
          choices={[
            { label: "AIOS", value: "AIOS" },
            { label: "Aliexpress", value: "Aliexpress" },
          ]}
          selected={productType || []}
          onChange={handleProductTypeChange}
          allowMultiple
        />
      ),
    },
    {
      key: "status",
      label: "Status ",
      filter: (
        <ChoiceList
          title="Status"
          titleHidden
          choices={[
            { label: "Unpublished", value: "Unpublished" },
            { label: "Published", value: "Published" },
          ]}
          selected={taggedWith || []}
          onChange={handleTaggedWithChange}
          allowMultiple
        />
      ),
    },
  ];

  // const filters = [
  //   {
  //     key: "rating",
  //     label: "Rating",
  //     filter: (
  //       <ChoiceList
  //         title="Rating"
  //         titleHidden
  //         choices={[
  //           { label: "5 Stars", value: "5 Stars" },
  //           { label: "4 Stars", value: "4 Stars" },
  //           { label: "3 Stars", value: "3 Stars" },
  //           { label: "2 Stars", value: "2 Stars" },
  //           { label: "1 Stars", value: "1 Stars" },
  //         ]}
  //         selected={accountStatus || []}
  //         onChange={handleRatingChange}
  //         allowMultiple
  //       />
  //     ),
  //     shortcut: true,
  //   },
  //   {
  //     key: "source",
  //     label: "Source",
  //     filter: (
  //       <ChoiceList
  //         title="Source"
  //         titleHidden
  //         choices={[{ label: "aios", value: "AIOS" }]}
  //         selected={accountStatus || []}
  //         onChange={handleRatingChange}
  //         allowMultiple
  //       />
  //     ),
  //     shortcut: true,
  //   },
  //   {
  //     key: "status",
  //     label: "Status",
  //     filter: (
  //       <ChoiceList
  //         title="Status"
  //         titleHidden
  //         choices={[
  //           { label: "Unpublished", value: "Unpublished" },
  //           { label: "Published", value: "Published" },
  //         ]}
  //         selected={accountStatus || []}
  //         onChange={handleRatingChange}
  //         allowMultiple
  //       />
  //     ),
  //     shortcut: true,
  //   },
  // ];
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

  const toastMarkup = active ? (
    <Frame>
      <Toast content={msgData} onDismiss={toggleActive} error={error} />
    </Frame>
  ) : null;

  const resourceName = {
    singular: "review",
    plural: "reviews",
  };

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
        setFilteredReviews(result.data);
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
  const promotedBulkActions = [
    {
      content: "Publish",
      loading: buttonloading,
      onAction: () => handlePublish(productId, store),
    },
  ];

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

  const handleChange = (value, property) => {
    setEditReview((editReview) => ({
      ...editReview,
      [property]: value,
    }));
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(filteredReviews);

  const [editReview, setEditReview] = useState({
    rating: "",
    name: "",
    date: "",
    email: "",
    content: "",
  });

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
  const handleUpdate = async () => {
    setButtonLoader(true);
    try {
      const data = {
        product_id: productId,
        store_name: store,
        id: editReviewId,
        editReview: editReview,
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

      if (result.success) {
        setActive(true);
        setActiveField(false);
        setButtonLoader(false);
        setError(false);
        setMsgData("Updated successfully ");

        setShowEditModal(false);
        setFilteredReviews(result.data);
      } else {
        setButtonLoader(false);
        setActive(true);
        setActiveField(false);
        setError(true);
        setShowEditModal(false);
        setMsgData("There is some error while update");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setButtonLoader(false);
    }
  };

  // const handleUpdate = async () => {
  //   try {
  //     const data = {
  //       product_id: productId,
  //       store_name: store,
  //       editReview: editReview,
  //     };

  //     const response = await fetch("/api/updateReview", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }

  //     const result = await response.json();
  //     if (result.success) {
  //       setActive(true);
  //       setActiveField(false);
  //       setButtonLoading(false);
  //       setFilteredReviews(result.data);
  //       setMsgData("Review Updated");
  //       setShowEditModal(false);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setButtonLoading(false);
  //   }
  // };

  let handleClose = () => {
    setShowEditModal(false);
  };
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [editConsent, setEditConsent] = useState(true);
  const editModal = (
    <div className="modals">
      <Frame>
        <Modal
          open={showEditModal}
          onClose={handleClose}
          title="Update the review"
          primaryAction={{
            content: "Update",
            onAction: handleUpdate,
            disabled: !editConsent,
            loading: buttonLoader,
          }}
          secondaryActions={[
            {
              content: "Close",
              onAction: handleClose,
            },
          ]}
        >
          <Modal.Section>
            <BlockStack gap={300}>
              <TextField
                value={editReview.rating}
                label="Rating"
                readOnly
                helpText={"The rating is not editable."}
              />
              <TextField
                onChange={(e) => {
                  handleChange(e, "name");
                }}
                value={editReview.name}
                label="Name"
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
                  value={formatDate(editReview.date)}
                  label="Date"
                  type="date"
                />
                <TextField
                  value={editReview.email}
                  type="email"
                  onChange={(e) => {
                    handleChange(e, "email");
                  }}
                  label="Email"
                />
              </InlineGrid>
              <TextField
                value={editReview.content}
                label="Review "
                onChange={(e) => {
                  handleChange(e, "content");
                }}
                multiline={2}
              />
              <Checkbox
                checked={editConsent}
                onChange={() => setEditConsent(!editConsent)}
                label="I have consent from the reviewer to edit this review."
              />
            </BlockStack>
          </Modal.Section>
        </Modal>
      </Frame>
    </div>
  );

  const [reply, setReply] = useState("");
  const handleReplyModal = useCallback((review, id) => {
    setReply(review.storeReply);
    setShowReplyModal(true);
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
        setFilteredReviews(result.data);
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

  const [showReplyModal, setShowReplyModal] = useState(false);
  const replyModal = (
    <div className="modals">
      <Frame>
        <Modal
          open={showReplyModal}
          onClose={() => setShowReplyModal(false)}
          title="Reply to the review"
          primaryAction={{
            content: "Save Reply",
            loading: buttonLoader,
            onAction: () => handleSaveReply(),
          }}
          secondaryActions={[
            {
              content: "Close",
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

  const [modalphotos, setModalPhotos] = useState([]);
  const [showPhotosModal, setShowPhotoModal] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const handlePhotModal = useCallback((review, id) => {
    setModalPhotos(review.image);
    setUploadedImages(review.image);
    setEditReviewId(id);
    setNewFiles([]);
    setShowPhotoModal(true);
  }, []);

  const handleDeleteImage = (photoUrl) => {
    URL.revokeObjectURL(photoUrl);

    setUploadedImages((prevImages) =>
      prevImages.filter((image) => image !== photoUrl),
    );

    setNewFiles((prevFiles) => {
      const fileUrlIndex = prevFiles.findIndex(
        (file) => URL.createObjectURL(file) === photoUrl,
      );
      if (fileUrlIndex !== -1) {
        const newFilesCopy = [...prevFiles];
        newFilesCopy.splice(fileUrlIndex, 1);
        return newFilesCopy;
      }
      return prevFiles;
    });
  };

  const handleImageUpload = (id, event) => {
    const files = Array.from(event.target.files);
    const fileArray = files.map((file) => URL.createObjectURL(file));
    const newImages = [...files];

    setNewFiles((prevData) => [...prevData, ...files]);
    setUploadedImages((prevImages) => [...prevImages, ...fileArray]);
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

  function truncateContent(content, wordLimit) {
    const words = content.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return content;
  }

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
        setNewFiles([]);
        setActiveField(false);
        setError(true);
        setMsgData("There is some error while update");
      }
    } catch (err) {
      setShowPhotoModal(false);
    }
  };
  const photoModal = (
    <div className="modals">
      <Frame>
        <Modal
          open={showPhotosModal}
          onClose={() => setShowPhotoModal(false)}
          title="Update images"
          primaryAction={{
            content: "Save",
            onAction: handleSaveImageModal,
            loading: buttonLoader,
          }}
          secondaryActions={[
            {
              content: "Close",
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
                    onChange={(event) => handleImageUpload(editReviewId, event)}
                  />
                  <Icon source={PlusIcon}></Icon>
                </div>
              </InlineGrid>
              <Text tone="subdued">
                The file size should not be more than 10Mb.
              </Text>
            </BlockStack>
          </Modal.Section>
        </Modal>
      </Frame>
    </div>
  );

  const handlePublishReviews = async (review, id, action) =>{
   
    const data = {
      action,
      product_id: productId,
      store_name: store,
      ids: [id],
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
      setMsgData(`Published Successfully`);
    } else {
      setButtonLoader(false);
      setActive(true);
      setActiveField(false);
      setError(true);
      setMsgData("There is some error while update");
    }

  }
  const rowMarkup =
    filteredReviews.length > 0 ? (
      filteredReviews.map(
        (
          {
            id,
            name,
            featured,
            reviewDesc,
            storeReply,
            email,
            source,
            rating,
            createdAt,
            status,
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
                    {featured && <Badge tone="info">Featured</Badge>}
                    {storeReply && <Badge tone="info">Replied</Badge>}
                  </InlineStack>
                </BlockStack>
              </IndexTable.Cell>
              <IndexTable.Cell>{source}</IndexTable.Cell>
              <IndexTable.Cell>
                <span
                  onClick={() => handlePhotModal(filteredReviews[index], id)}
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
                {status == "Published" ? (
                  <Badge tone="success">Published</Badge>
                ) : (
                  <Badge>Unpublished</Badge>
                )}
              </IndexTable.Cell>

              <IndexTable.Cell>{formattedDate}</IndexTable.Cell>
              <IndexTable.Cell>
                <ButtonGroup>
                  <Tooltip content="Edit review">
                    <Button
                      icon={EditIcon}
                      accessibilityLabel="Edit review"
                      onClick={() =>
                        handleEditModal(filteredReviews[index], id)
                      }
                      variant="tertiary"
                    />
                  </Tooltip>
                  <Tooltip content="Write a reply">
                    <Button
                      icon={ReplayIcon}
                      accessibilityLabel="Write a reply"
                      onClick={() =>
                        handleReplyModal(filteredReviews[index], id)
                      }
                      variant="tertiary"
                    />
                  </Tooltip>
                  <Tooltip content="Publish the reviews">
                    <Button
                    icon={ SendIcon}
                      accessibilityLabel="Publish "
                      onClick={() =>
                        handlePublishReviews(filteredReviews[index], id,"publish")
                        
                      }
                      loading= {buttonloading}
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
      <div>No reviews found</div>
    );

  const emptyStateMarkup = (
    <EmptySearchResult
      title={"No reviews"}
      description={"There are no reviews for this product for searched query "}
      withIllustration
    />
  );

  const title =
    filteredReviews.length > 0
      ? `${filteredReviews[0].product_title}`
      : "No reviews";


      const handlePageNavigate = () =>{
        shopify.loading(true)
      navigate("/app/product_reviews?tab=reviews")
      }



  return (
    <Page
      fullWidth
      title={`${title} · reviews`}
      backAction={{
        content: "Back",
        onAction: handlePageNavigate,
      }}
      // actionGroups={[
      //   {
      //     title: "More actions",
      //     actions: [
      //       { content: "Duplicate" },
      //       { content: "Print" },
      //       { content: "Unarchive" },
      //       { content: "Cancel order" },
      //     ],
      //   },
      // ]}
    >
      {/* <Table/> */}
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
              itemCount={filteredReviews.length}
              selectedItemsCount={
                allResourcesSelected ? "All" : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              headings={[
                { title: "Name" },
                { title: "Rating" },
                { title: "Review Content" },
                { title: "Source" },
                { title: "Photos" },
                { title: "Status" },
                { title: "Date" },
                { title: "Actions" },
              ]}
              bulkActions={bulkActions}
              promotedBulkActions={promotedBulkActions}
            >
              {rowMarkup}
            </IndexTable>
          </Card>
        </Layout.Section>
      </Layout>
      {editModal}
      {replyModal}
      {photoModal}
      {toastMarkup}
    </Page>
  );
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
};

export default ProductReview;
