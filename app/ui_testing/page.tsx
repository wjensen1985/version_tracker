import { Fragment } from "react"
import { CardSkeleton } from "../ui/skeletons"

export default function Page(){
    return (
        <Fragment>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
        </Fragment>
    )    
}