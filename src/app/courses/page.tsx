import { createClient } from "@/utils/supabase/server";
import CoursesClientWrapper from "./CoursesClientWrapper"; // Import the new client wrapper

const CoursesPage = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const currentUser = user ? { id: user.id } : null;

  if (!currentUser) {
    return <div className="flex h-screen items-center justify-center">Please log in to view courses.</div>;
  }

  return <CoursesClientWrapper user={currentUser} />;
};

export default CoursesPage; 