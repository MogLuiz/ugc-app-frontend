import { AuthGuard } from "~/components/auth-guard";
import { ChatScreen } from "~/modules/chat/components/chat-screen";

export default function ChatRoute() {
  return (
    <AuthGuard allowedRoles={["business", "creator"]}>
      <ChatScreen />
    </AuthGuard>
  );
}
