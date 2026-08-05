import Link from "next/link";


type AttributeValue = {
    id: string;
    value: string;
    createdAt: Date;
};


type Props = {
    attributeId: string;
    values: AttributeValue[];
};


export default function AttributeValueTable({
    attributeId,
    values,
}: Props) {

    return (

        <div className="overflow-hidden rounded border">

            <table className="w-full">

                <thead>

                    <tr className="border-b bg-gray-50 text-left">

                        <th className="p-3">
                            Value
                        </th>


                        <th className="p-3">
                            Created
                        </th>

                        <th className="p-3">
                            Actions
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {
                        values.map((item) => (

                            <tr
                                key={item.id}
                                className="border-b"
                            >

                                <td className="p-3 font-medium">
                                    {item.value}
                                </td>


                                <td className="p-3">
                                    {
                                        item.createdAt
                                            .toLocaleDateString()
                                    }
                                </td>


                                <td className="p-3">

                                    <div className="flex gap-2">

                                        <Link
                                            href={`/admin/attributes/${attributeId}/values/${item.id}/edit`}
                                            className="rounded bg-blue-600 px-3 py-2 text-sm text-white"
                                        >
                                            Edit
                                        </Link>

                                    </div>

                                </td>

                            </tr>

                        ))
                    }


                    {
                        values.length === 0 && (

                            <tr>

                                <td
                                    colSpan={3}
                                    className="p-6 text-center"
                                >
                                    No values found.
                                </td>

                            </tr>

                        )
                    }

                </tbody>

            </table>

        </div>

    );
}