'use client';
import Layout from '@/app/components/layout';
import PForm from '@/app/components/ProductForm';
export default function Page() {
  return(
    <Layout>
      <PForm form={"Create New Product"}/>
    </Layout>
  )
}
