import { Box } from "@chakra-ui/react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/layouts/AppLayout";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ScheduleListPage } from "@/pages/schedules/ScheduleListPage";
import { ScheduleDetailPage } from "@/pages/schedules/ScheduleDetailPage";
import { MemberListPage } from "@/pages/members/MemberListPage";
import { MemberDetailPage } from "@/pages/members/MemberDetailPage";
import { InviteKeysPage } from "@/pages/InviteKeysPage";
import { NoticesPage } from "@/pages/NoticesPage";
import { GalleryPage } from "@/pages/GalleryPage";
import { SettlementListPage } from "@/pages/settlements/SettlementListPage";
import { SettlementDetailPage } from "@/pages/settlements/SettlementDetailPage";
import { BadgesPage } from "@/pages/BadgesPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

function App() {
  const basename = import.meta.env.BASE_URL ?? "/";
  return (
    <BrowserRouter basename={basename}>
      <Box minH="100vh" bg="gray.50">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="schedules" element={<ScheduleListPage />} />
            <Route path="schedules/:id" element={<ScheduleDetailPage />} />
            <Route path="members" element={<MemberListPage />} />
            <Route path="members/:id" element={<MemberDetailPage />} />
            <Route path="invite-keys" element={<InviteKeysPage />} />
            <Route path="notices" element={<NoticesPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="settlements" element={<SettlementListPage />} />
            <Route path="settlements/:id" element={<SettlementDetailPage />} />
            <Route path="badges" element={<BadgesPage />} />
          </Route>
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;
