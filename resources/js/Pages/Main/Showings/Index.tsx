import AuthenticatedLayout from "@/Layouts/AdminLayout";
import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard() {
    return (
        <MainLayout>
            <Head title="Repertuar" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            Zostałeś zalogowany
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
