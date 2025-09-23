-- CreateTable
CREATE TABLE "sellerInvoice" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "deliveryCharge" DECIMAL(65,30) NOT NULL,
    "subTotal" DECIMAL(65,30) NOT NULL,
    "shippingInfo" JSONB NOT NULL,
    "paymentType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sellerInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sellerInvoiceItem" (
    "id" TEXT NOT NULL,
    "sellerInvoiceId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "discountPrice" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "sellerInvoiceItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sellerInvoice" ADD CONSTRAINT "sellerInvoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sellerInvoice" ADD CONSTRAINT "sellerInvoice_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sellerInvoiceItem" ADD CONSTRAINT "sellerInvoiceItem_sellerInvoiceId_fkey" FOREIGN KEY ("sellerInvoiceId") REFERENCES "sellerInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
