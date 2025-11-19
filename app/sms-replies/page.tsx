import { redirect } from 'next/navigation'

export default function SmsRepliesPage() {
  // Redirect to the new unified Replies page
  // The SMS tab will be shown by default in the new page
  redirect("/replies")
}
