export const enquiryMailboxMap = {
  "General Enquiry": "contact@whitehorseinnlaunceston.co.uk",
};

export const fallbackContactMailbox = "contact@whitehorseinnlaunceston.co.uk";

export function getMailboxForEnquiryType(enquiryType) {
  return enquiryMailboxMap[enquiryType] || fallbackContactMailbox;
}
