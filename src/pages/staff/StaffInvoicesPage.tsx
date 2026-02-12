import { useEffect, useMemo, useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import StaffSidebar from "../../components/StaffSidebar";
import Toast from "../../components/Toast";
import {
  Plus,
  FileText,
  Calendar,
  Download,
  Receipt,
  Trash2,
} from "lucide-react";
import { getCurrentUser } from "../../api/users";
import {
  createStaffInvoice,
  getStaffInvoices,
  getMyStaffProjects,
} from "../../api/staff";
import { downloadFile } from "../../utils/download";

interface StaffProject {
  id: string;
  name: string;
}

interface LineItemDraft {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceSummary {
  id: string;
  invoiceNumber: string;
  projectName: string;
  projectId: string;
  clientName: string;
  status: string;
  issueDate: string | Date;
  dueDate: string | Date;
  subtotal: number;
  tax: number;
  total: number;
  clientMarkedPaid: boolean;
  lineItems: InvoiceItem[];
  invoiceUrl: string;
  receiptUrl?: string | null;
}

interface UserData {
  id: string;
  name: string;
  email: string;
}

export default function StaffInvoicesPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [projects, setProjects] = useState<StaffProject[]>([]);
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [projectId, setProjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tax, setTax] = useState(0);
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<LineItemDraft[]>([
    { id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 },
  ]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [user, staffProjects, staffInvoices] = await Promise.all([
          getCurrentUser(),
          getMyStaffProjects(),
          getStaffInvoices(),
        ]);
        if (isMounted) {
          setUserData(user);
          setProjects(
            staffProjects.map((project: any) => ({
              id: project.id,
              name: project.name,
            })),
          );
          setInvoices(staffInvoices);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const subtotal = useMemo(
    () => lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0),
    [lineItems],
  );

  const total = subtotal + tax;

  const addLineItem = () =>
    setLineItems((items) => [
      ...items,
      { id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 },
    ]);

  const removeLineItem = (index: number) =>
    setLineItems((items) => items.filter((_, i) => i !== index));

  const updateLineItem = (
    index: number,
    field: keyof LineItemDraft,
    value: string | number,
  ) => {
    setLineItems((items) =>
      items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const formatDate = (value: string | Date) => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString();
  };

  const canDownloadInvoice = (status: string) =>
    status === "APPROVED" || status === "PAID";

  const handleDownloadInvoice = async (invoice: InvoiceSummary) => {
    if (!canDownloadInvoice(invoice.status)) {
      setToastMessage("Invoice is not yet approved for download.");
      return;
    }
    try {
      await downloadFile(
        invoice.invoiceUrl,
        `invoice-${invoice.invoiceNumber}.pdf`,
      );
    } catch (err) {
      console.error(err);
      setToastMessage("Unable to download invoice. Please try again.");
    }
  };

  const handleCreateInvoice = async () => {
    if (!projectId || !dueDate) return;

    const payload = {
      projectId,
      dueDate,
      lineItems: lineItems.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
      })),
      tax,
      notes: notes || undefined,
    };

    await createStaffInvoice(payload);
    const refreshed = await getStaffInvoices();
    setInvoices(refreshed);
    setProjectId("");
    setDueDate("");
    setTax(0);
    setNotes("");
    setLineItems([{ id: null, description: "", quantity: 1, rate: 0 }]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {toastMessage && (
        <Toast message={toastMessage} tone="error" onClose={() => setToastMessage(null)} />
      )}
      <AuthNavbar
        currentPage="staff"
        userName={userData?.name}
        userEmail={userData?.email}
        userAvatar=""
        notificationCount={3}
      />
      <StaffSidebar activeItem="invoices" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-4xl mb-2" style={{ color: "#001f54" }}>
              Invoices
            </h1>
            <p className="text-gray-600">
              Create invoices for your assigned projects and track billing.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: "#001f54" }}
            >
              Create Invoice
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Project
                </label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Select project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Tax</label>
                <input
                  type="number"
                  value={tax}
                  onChange={(e) => setTax(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {lineItems.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3"
                >
                  <input
                    className="md:col-span-6 border rounded-lg px-3 py-2"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      updateLineItem(index, "description", e.target.value)
                    }
                  />
                  <input
                    className="md:col-span-2 border rounded-lg px-3 py-2"
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) =>
                      updateLineItem(index, "quantity", Number(e.target.value))
                    }
                  />
                  <input
                    className="md:col-span-2 border rounded-lg px-3 py-2"
                    type="number"
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) =>
                      updateLineItem(index, "rate", Number(e.target.value))
                    }
                  />
                  <div className="md:col-span-2 flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      ₦{(item.quantity * item.rate).toLocaleString()}
                    </span>
                    <button
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                      onClick={() => removeLineItem(index)}
                      type="button"
                      disabled={lineItems.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={addLineItem}
                className="inline-flex items-center gap-2 text-sm text-blue-600"
                type="button"
              >
                <Plus className="w-4 h-4" /> Add line item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2 flex items-end justify-end">
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Subtotal: ₦{subtotal.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Tax: ₦{tax.toLocaleString()}
                  </p>
                  <p
                    className="text-lg font-semibold"
                    style={{ color: "#001f54" }}
                  >
                    Total: ₦{total.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleCreateInvoice}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: "#4169e1" }}
            >
              <FileText className="w-4 h-4" /> Create Invoice
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div
              className="px-6 py-4 border-b"
              style={{ borderColor: "#e5e7eb" }}
            >
              <h2
                className="text-lg font-semibold"
                style={{ color: "#001f54" }}
              >
                Your Invoices
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Invoice #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Due
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "#e5e7eb" }}>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm font-mono text-blue-700">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {invoice.projectName}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {invoice.clientName}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(invoice.dueDate)}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-right text-sm font-semibold">
                        ₦{invoice.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {invoice.status}
                        {invoice.clientMarkedPaid && (
                          <p className="text-xs text-gray-500">
                            Client marked paid
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDownloadInvoice(invoice)}
                            className="p-2 rounded-lg hover:bg-gray-100"
                            title="Download Invoice"
                          >
                            <Download className="w-4 h-4 text-gray-600" />
                          </button>
                          {invoice.receiptUrl && (
                            <button
                              onClick={async () => {
                                try {
                                  await downloadFile(
                                    invoice.receiptUrl ?? "",
                                    `receipt-${invoice.invoiceNumber}.pdf`,
                                  );
                                } catch (err) {
                                  console.error(err);
                                  setToastMessage(
                                    "Unable to download receipt. Please try again.",
                                  );
                                }
                              }}
                              className="p-2 rounded-lg hover:bg-gray-100"
                              title="Download Receipt"
                            >
                              <Receipt className="w-4 h-4 text-gray-600" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
