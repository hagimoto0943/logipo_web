import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@components/ui/sidebar"
import { AppSidebar } from '@components/app/Sidebar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@components/ui/breadcrumb'
import { Separator } from "@components/ui/separator";


export default function Root() {
  const location = useLocation();

  return (
    <main>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header> */}
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
