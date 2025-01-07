// src/app/api/slpp/petitions/route.ts
import { NextResponse } from 'next/server';
import { getAllPetitions, getOpenPetitions } from '@/lib/firebase/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let petitions;
    if (status === 'open') {
      petitions = await getOpenPetitions();
    } else {
      petitions = await getAllPetitions();
    }

    return NextResponse.json({
      success: true,
      petitions: petitions.map(petition => ({
        petition_id: petition.id,
        status: petition.status,
        petition_title: petition.title,
        petition_text: petition.content,
        petitioner: petition.petitioner.email,
        signatures: petition.signatures,
        response: petition.response
      }))
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}